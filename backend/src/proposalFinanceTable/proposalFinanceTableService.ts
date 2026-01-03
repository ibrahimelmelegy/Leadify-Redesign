import ProposalFinanceTableItem from '../ProposalFinanceTableItem/proposalFinanceTableItemModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import ProposalFinanceTable from './proposalFinanceTableModel';
import materialService from '../additionalMaterial/material.service';
import { Includeable, WhereOptions, Op, Sequelize } from 'sequelize';
import { ProposalActionEnum } from '../proposalLog/proposalLogEnum';
import proposalLogService from '../proposalLog/proposalLogService';
import User from '../user/userModel';
import { UpdateProposalFinanceTableInput } from './inputs/updateProposalFinanceTableInput';
import proposalService from '../proposal/proposalService';
import { CreateProposalFinanceTableInput } from './inputs/createProposalFinanceTableInput';

class ProposalFinanceTableService {
  public async createFinanceTable(data: CreateProposalFinanceTableInput, user: User): Promise<ProposalFinanceTable> {
    //  if (!data.financeTable) return null;
    const existFinanceTable = await ProposalFinanceTable.findOne({
      where: {
        proposalId: data.proposalId
      }
    });
    if (existFinanceTable) throw new BaseError(ERRORS.PROPOSAL_FINANCE_TABLE_ALREADY_EXIST);
    const proposal = await proposalService.proposalOrError({ id: data.proposalId });
    await proposalService.validateProposalAccess(proposal.id, user);
    const { items = [], discount = 0, marginPercentage = 0 } = data;
    let grandTotalPrice = 0;

    const calculatedItems = await Promise.all(
      items.map(async (item: any) => {
        const material = await materialService.materialOrError({ id: item.materialId });
        const marginAmount = (material.unitPrice * marginPercentage) / 100;
        const unitPrice = material.unitPrice + marginAmount;
        const description = material.description;
        const totalPrice = item.qty * unitPrice;
        grandTotalPrice += totalPrice;

        return {
          ...item,
          marginAmount,
          unitPrice,
          description,
          totalPrice
        };
      })
    );

    const vat = Math.max(0, (grandTotalPrice - discount) * 0.15);
    const finalTotalPrice = Math.max(0, grandTotalPrice - discount + vat);

    const financeTable = await ProposalFinanceTable.create({
      proposalId: proposal.id,
      grandTotalPrice,
      discount,
      vat,
      marginPercentage,
      finalTotalPrice
    });

    if (calculatedItems.length > 0) {
      const financeTableItems = calculatedItems.map((item: any) => ({
        ...item,
        financeTableId: financeTable.id
      }));
      await ProposalFinanceTableItem.bulkCreate(financeTableItems);
    }

    await proposalLogService.createProposalLog(user.id, proposal.id, ProposalActionEnum.FINANCE_TABLE_CREATED);

    return financeTable;
  }

  public async updateFinanceTable(id: string, data: UpdateProposalFinanceTableInput, user: User): Promise<ProposalFinanceTable> {
    const table = await this.proposalFinanceTableOrError({ id }, [
      {
        model: ProposalFinanceTableItem, // Include the related table items
        attributes: ['id', 'qty', 'unitPrice', 'marginAmount', 'financeTableId', 'totalPrice']
      }
    ]);
    await proposalService.validateProposalAccess(table.proposalId, user);

    // Extract discount from data or use existing value
    const discount = data.discount ?? table.discount;

    // Check if marginPercentage is updated and update ProposalFinanceTableItem accordingly
    if (data.marginPercentage && data.marginPercentage !== table.marginPercentage) {
      const tableItems = table.items; // Assuming association is correctly set up

      for (const item of tableItems) {
        // Recalculate unitPrice and marginAmount
        const newMarginAmount = (data.marginPercentage * item.unitPrice) / 100;
        const newUnitPrice = item.unitPrice - item.marginAmount + newMarginAmount;
        const totalPrice = item.qty * newUnitPrice;

        // Update the item in the database
        await item.update({
          marginAmount: newMarginAmount,
          unitPrice: newUnitPrice,
          totalPrice
        });
      }
    }

    // **Recalculate grandTotalPrice** as the sum of all item `totalPrice`
    // **Fetch updated table items explicitly**
    const updatedTableItems = await ProposalFinanceTableItem.findAll({
      where: { financeTableId: table.id }
    });
    const grandTotalPrice = updatedTableItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // **Recalculate VAT & Final Total Price**
    const vat = Math.max(0, (grandTotalPrice - discount) * 0.15);
    const finalTotalPrice = Math.max(0, grandTotalPrice - discount + vat);

    // **Update the finance table with recalculated values**
    await table.update({
      grandTotalPrice,
      vat,
      finalTotalPrice,
      ...data // Retain other properties from input data
    });

    // Log the update
    await proposalLogService.createProposalLog(user.id, table.proposalId, ProposalActionEnum.FINANCE_TABLE_UPDATED);

    return table;
  }

  public async getFinanceTables(query: any): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { rows: tables, count: totalItems } = await ProposalFinanceTable.findAndCountAll({
      where: {
        ...(query.proposalId && { proposalId: query.proposalId }),
        ...(query.searchKey && {
          [Op.or]: [{ grandTotalPrice: { [Op.iLike]: `%${query.searchKey}%` } }]
        })
      },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      docs: tables,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async financeTableById(id: string): Promise<ProposalFinanceTable> {
    return await this.proposalFinanceTableOrError({ id });
  }

  public async deleteFinanceTable(id: string, user: User): Promise<void> {
    const table = await this.proposalFinanceTableOrError({ id });
    await proposalService.validateProposalAccess(table.proposalId, user);
    await proposalLogService.createProposalLog(user.id, table.proposalId, ProposalActionEnum.FINANCE_TABLE_DELETED);
    await table.destroy();
  }

  async proposalFinanceTableOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<ProposalFinanceTable> {
    const table = await ProposalFinanceTable.findOne({ where: filter, include: joinedTables || [] });
    if (!table) throw new BaseError(ERRORS.PROPOSAL_FINANCE_TABLE_NOT_FOUND);
    return table;
  }

  public async deleteFinanceTableCustomColumn(id: string, customColumnKey: string, user: User): Promise<void> {
    const table = await this.proposalFinanceTableOrError({ id });
    await proposalService.validateProposalAccess(table.proposalId, user);

    await ProposalFinanceTableItem.update(
      {
        customColumns: Sequelize.literal(`
      COALESCE(
        (
          SELECT jsonb_agg(elem)
          FROM jsonb_array_elements("customColumns") AS elem
          WHERE elem->>'key' != '${customColumnKey}'
        ), '[]'::jsonb
      )
    `)
      },
      {
        where: { financeTableId: id },
        returning: true
      }
    );

    await proposalLogService.createProposalLog(user.id, table.proposalId, ProposalActionEnum.FINANCE_TABLE_ITEM_UPDATED);
  }
}

export default new ProposalFinanceTableService();
