import { Includeable, Op, WhereOptions } from 'sequelize';
import ProposalFinanceTableItem from './proposalFinanceTableItemModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import materialService from '../additionalMaterial/material.service';
import proposalFinanceTableService from '../proposalFinanceTable/proposalFinanceTableService';
import proposalLogService from '../proposalLog/proposalLogService';
import User from '../user/userModel';
import ProposalContent from '../proposalContent/proposalContentModel';
import { ProposalActionEnum } from '../proposalLog/proposalLogEnum';
import proposalService from '../proposal/proposalService';
class ProposalFinanceTableItemService {
  public async createProposalFinanceTableItem(data: any, user: User): Promise<ProposalFinanceTableItem> {
    const material = await materialService.materialOrError({ id: data.materialId });
    const financeTable = await proposalFinanceTableService.proposalFinanceTableOrError({ id: data.financeTableId }, [
      // {
      //   model: ProposalContent,
      //   attributes: ['id', 'proposalId']
      // }
    ]);
    await proposalService.validateProposalAccess(financeTable.proposalId, user);
    const marginAmount = (material.unitPrice * financeTable.marginPercentage) / 100;
    const unitPrice = material.unitPrice + marginAmount;
    const description = material.description;
    const totalPrice = data.qty * unitPrice;
    //update finance table grand total price

    financeTable.grandTotalPrice += totalPrice;
    financeTable.vat = Math.max(0, (financeTable.grandTotalPrice - financeTable.discount) * 0.15);
    financeTable.finalTotalPrice = Math.max(0, financeTable.grandTotalPrice - financeTable.discount + financeTable.vat);
    financeTable.save();
    await proposalLogService.createProposalLog(user.id, financeTable.proposalId, ProposalActionEnum.FINANCE_TABLE_ITEM_CREATED);
    return await ProposalFinanceTableItem.create({ ...data, marginAmount, unitPrice, description, totalPrice: parseFloat(totalPrice.toFixed(2)) });
  }

  public async updateProposalFinanceTableItem(id: string, data: any, user: User): Promise<ProposalFinanceTableItem> {
    const item = await this.proposalFinanceTableItemOrError({ id });
    const financeTable = await proposalFinanceTableService.proposalFinanceTableOrError({ id: item.financeTableId }, [
      // {
      //   model: ProposalContent,
      //   attributes: ['id', 'proposalId']
      // }
    ]);
    await proposalService.validateProposalAccess(financeTable.proposalId, user);

    if (data.qty) {
      data.totalPrice = parseFloat((data.qty * item.unitPrice).toFixed(2));
      //update finance table grand total price
      financeTable.grandTotalPrice += data.totalPrice - item.totalPrice;
      financeTable.vat = Math.max(0, (financeTable.grandTotalPrice - financeTable.discount) * 0.15);
      financeTable.finalTotalPrice = Math.max(0, financeTable.grandTotalPrice - financeTable.discount + financeTable.vat);
      financeTable.save();
    }
    await item.update(data);
    await proposalLogService.createProposalLog(user.id, financeTable.proposalId, ProposalActionEnum.FINANCE_TABLE_ITEM_UPDATED);
    return item;
  }

  public async getProposalFinanceTableItems(query: any): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { rows: items, count: totalItems } = await ProposalFinanceTableItem.findAndCountAll({
      where: {
        ...(query.financeTableId && { financeTableId: query.financeTableId }),
        ...(query.searchKey && {
          [Op.or]: [{ description: { [Op.iLike]: `%${query.searchKey}%` } }]
        })
      },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      docs: items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async proposalFinanceTableItemById(id: string): Promise<ProposalFinanceTableItem> {
    return await this.proposalFinanceTableItemOrError({ id });
  }

  public async deleteProposalFinanceTableItem(id: string, user: User): Promise<void> {
    const item = await this.proposalFinanceTableItemOrError({ id });
    //update finance table grand total price
    const financeTable = await proposalFinanceTableService.proposalFinanceTableOrError({ id: item.financeTableId }, [
      // {
      //   model: ProposalContent,
      //   attributes: ['id', 'proposalId']
      // }
    ]);
    await proposalService.validateProposalAccess(financeTable.proposalId, user);
    financeTable.grandTotalPrice -= item.totalPrice;
    financeTable.vat = Math.max(0, (financeTable.grandTotalPrice - financeTable.discount) * 0.15);
    financeTable.finalTotalPrice = Math.max(0, financeTable.grandTotalPrice - financeTable.discount + financeTable.vat);
    financeTable.save();
    await proposalLogService.createProposalLog(user.id, financeTable.proposalId, ProposalActionEnum.FINANCE_TABLE_ITEM_DELETED);
    await item.destroy();
  }

  async proposalFinanceTableItemOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<ProposalFinanceTableItem> {
    const item = await ProposalFinanceTableItem.findOne({ where: filter, include: joinedTables || [] });
    if (!item) throw new BaseError(ERRORS.PROPOSAL_FINANCE_TABLE_ITEM_NOT_FOUND);
    return item;
  }
}

export default new ProposalFinanceTableItemService();
