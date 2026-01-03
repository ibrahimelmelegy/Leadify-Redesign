import { Includeable, Op, WhereOptions } from 'sequelize';
import Proposal from './models/proposalModel';
import { UpdateProposalInput } from './inputs/updateProposalInput';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import User from '../user/userModel';
import uploaderService from '../uploader/uploader.service';
import Project from '../project/models/projectModel';
import Deal from '../deal/model/dealModel';
import Opportunity from '../opportunity/opportunityModel';
import ProposalContent from '../proposalContent/proposalContentModel';
import ProposalFinanceTable from '../proposalFinanceTable/proposalFinanceTableModel';
import { ProposalSortByEnum, ProposalStatusEnum } from './proposalEnum';
import notificationService from '../notification/notificationService';
import { RejectProposalInput } from './inputs/rejectProposalInput';
import ProposalFinanceTableItem from '../ProposalFinanceTableItem/proposalFinanceTableItemModel';
import { ProposalActionEnum } from '../proposalLog/proposalLogEnum';
import proposalLogService from '../proposalLog/proposalLogService';
import { AssignUserToProposalInput } from './inputs/assignUsersToProposalInput';
import { SortEnum } from '../lead/leadEnum';
import { ProposalPermissionsEnum } from '../role/roleEnum';
import ProposalUsers from './models/proposal_UsersModel';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';

class ProposalService {
  public async createProposal(data: any, user: User): Promise<Proposal> {
    if (data.reference) await this.errorIfProposalWithExistReference(data.reference);

    if (!data.users || !Array.isArray(data.users)) {
      data.users = [user.id];
    } else if (!data.users.includes(user.id)) {
      data.users.push(user.id);
    }

    await uploaderService.setFileReferences([data.companyLogo]);
    if (data.fileAttachments?.length) await uploaderService.setFileReferences(data.fileAttachments);
    const proposal = await Proposal.create(data);
    // Associate users with the proposal using $set
    if (data.users && Array.isArray(data.users)) await proposal.$set('users', data.users);
    await proposalLogService.createProposalLog(user.id, proposal.id, ProposalActionEnum.PROPOSAL_CREATED);
    await notificationService.sendProposalAssignUsersNotification(proposal, data.users);
    return proposal;
  }

  public async assignUsers(id: string, data: AssignUserToProposalInput, user: User): Promise<Proposal> {
    await this.validateProposalAccess(id, user);
    const proposal = await this.proposalOrError({ id }, [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'name'], // Include User details
        through: { attributes: [] } // Exclude join table attributes
      }
    ]);

    // Find newly assigned users and unassigned users
    const existingUserIds = new Set(proposal.users.map((u: User) => u.id));
    const newAssignedUsers = data.users.filter(userId => !existingUserIds.has(Number(userId))).map(userId => Number(userId));

    const unassignedUsers = proposal.users.filter((u: User) => !data.users.includes(String(u.id))).map((u: User) => u.id);

    // Assign new users
    if (newAssignedUsers.length > 0) {
      await proposal.$add('users', newAssignedUsers);
      await notificationService.sendProposalAssignUsersNotification(proposal, newAssignedUsers);
    }

    // Remove unassigned users
    if (unassignedUsers.length > 0) {
      await proposal.$remove('users', unassignedUsers);
    }

    await proposalLogService.createProposalLog(user.id, proposal.id, ProposalActionEnum.PROPOSAL_USERS_UPDATED);

    return proposal;
  }

  public async approveProposal(id: string, user: User): Promise<Proposal> {
    await this.validateProposalAccess(id, user);
    const proposal = await this.proposalOrError({ id }, [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'name'], // Include User details
        through: { attributes: [] } // Exclude join table attributes
      }
    ]);
    if (proposal.status === ProposalStatusEnum.APPROVED) throw new BaseError(ERRORS.PROPOSAL_ALREADY_APPROVED);

    await proposal.update({ status: ProposalStatusEnum.APPROVED });
    await notificationService.sendApproveProposalNotification(proposal);
    await proposalLogService.createProposalLog(user.id, proposal.id, ProposalActionEnum.PROPOSAL_APPROVED);

    return proposal;
  }

  public async rejectProposal(id: string, data: RejectProposalInput, user: User): Promise<Proposal> {
    await this.validateProposalAccess(id, user);
    const proposal = await this.proposalOrError({ id }, [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'name'], // Include User details
        through: { attributes: [] } // Exclude join table attributes
      }
    ]);
    if (proposal.status === ProposalStatusEnum.REJECTED) throw new BaseError(ERRORS.PROPOSAL_ALREADY_REJECTED);

    await proposal.update({ ...data, status: ProposalStatusEnum.REJECTED });
    await notificationService.sendRejectProposalNotification(proposal);
    await proposalLogService.createProposalLog(user.id, proposal.id, ProposalActionEnum.PROPOSAL_REJECTED);

    return proposal;
  }

  public async waitingApprovalProposal(id: string, user: User): Promise<Proposal> {
    await this.validateProposalAccess(id, user);
    const proposal = await this.proposalOrError({ id }, [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'name'], // Include User details
        through: { attributes: [] } // Exclude join table attributes
      }
    ]);
    if (proposal.status === ProposalStatusEnum.WAITING_APPROVAL) throw new BaseError(ERRORS.PROPOSAL_ALREADY_WAITING_APPROVAL);

    await proposal.update({ status: ProposalStatusEnum.WAITING_APPROVAL });
    await proposalLogService.createProposalLog(user.id, proposal.id, ProposalActionEnum.PROPOSAL_WAITING_APPROVAL);

    return proposal;
  }

  public async updateProposal(id: string, data: UpdateProposalInput, user: User): Promise<Proposal> {
    await this.validateProposalAccess(id, user);
    const proposal = await this.proposalOrError({ id });
    if (proposal.status !== ProposalStatusEnum.WAITING_APPROVAL) throw new BaseError(ERRORS.INVALID_PROPOSAL_STATUS_TO_UPDATE);
    if (data.reference) await this.errorIfProposalWithExistReference(data.reference, proposal.id);
    if (data.companyLogo) await uploaderService.setFileReferences([data.companyLogo]);
    if (data.fileAttachments?.length) await uploaderService.setFileReferences(data.fileAttachments);

    await proposal.update(data);
    await proposalLogService.createProposalLog(user.id, proposal.id, ProposalActionEnum.PROPOSAL_UPDATED);

    return proposal;
  }

  public async getProposals(query: any, user: User): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    if (!user.role.permissions.includes(ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS)) query.userId = user.id;

    const { rows: proposals, count: totalItems } = await Proposal.findAndCountAll({
      where: {
        ...(query.relatedEntityId && { relatedEntityId: query.relatedEntityId }),
        ...(query.searchKey && {
          [Op.or]: [
            { title: { [Op.iLike]: `%${query.searchKey}%` } },
            { reference: { [Op.iLike]: `%${query.searchKey}%` } },
            { version: { [Op.iLike]: `%${query.searchKey}%` } },
            { proposalFor: { [Op.iLike]: `%${query.searchKey}%` } }
          ]
        }),
        ...((query.fromDate || query.toDate) && {
          createdAt: {
            ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
            ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
          }
        }),
        ...(query.status &&
          query.status.length > 0 && {
            status: {
              [Op.in]: query.status // Matches any value in the array
            }
          }),
        ...(query.type &&
          query.type.length > 0 && {
            type: {
              [Op.in]: query.type // Matches any value in the array
            }
          })
      },
      include: [
        {
          model: Opportunity,
          as: 'opportunity',
          attributes: ['id', 'name'], // Include Opportunity details
          required: false // Allow for null opportunities
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'name'], // Include Deal details
          required: false // Allow for null deals
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name'], // Include Project details
          required: false // Allow for null projects
        },
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name'], // Include User details
          through: { attributes: [] }, // Exclude join table attributes
          ...(query.userId && {
            required: true, // <-- THIS is crucial to apply WHERE in count query
            where: { id: query.userId }
          })
        }
      ],
      limit: Number(limit),
      offset,
      distinct: true, // <-- THIS is crucial so count is not duplicated due to joins
      order: [
        [
          query.sortBy && Object.keys(ProposalSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
          query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
        ]
      ],
      attributes: ['id', 'title', 'version', 'proposalDate', 'type', 'reference', 'proposalFor', 'companyLogo', 'status', 'createdAt', 'updatedAt']
    });

    // Format results to include the appropriate related entity
    const formattedProposals = proposals.map(proposal => {
      const relatedEntity = proposal.opportunity || proposal.deal || proposal.project; // Determine the related entity dynamically
      proposal = proposal.toJSON();
      // Remove the raw fields from the JSON object
      delete proposal.opportunity;
      delete proposal.deal;
      delete proposal.project;
      return {
        ...proposal,
        relatedEntity
      };
    });

    return {
      docs: formattedProposals,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  private async errorIfProposalWithExistReference(reference: string, id?: string): Promise<void> {
    const proposalWithReference = await Proposal.findOne({ where: { reference, ...(id && { id: { [Op.ne]: id } }) } });
    if (proposalWithReference) throw new BaseError(ERRORS.REFERENCE_ALREADY_EXISTS);
  }

  public async getProposalById(id: string, user: User): Promise<any> {
    await this.validateProposalAccess(id, user);
    // Fetch the proposal along with all required associations
    const proposal = await this.proposalOrError({ id }, [
      {
        model: Opportunity,
        as: 'opportunity',
        attributes: ['id', 'name'], // Include Opportunity details
        required: false // Allow for null opportunities
      },
      {
        model: Deal,
        as: 'deal',
        attributes: ['id', 'name'], // Include Deal details
        required: false // Allow for null deals
      },
      {
        model: Project,
        as: 'project',
        attributes: ['id', 'name'], // Include Project details
        required: false // Allow for null projects
      },
      {
        model: User,
        as: 'users',
        attributes: ['id', 'name'], // Include User details
        through: { attributes: [] } // Exclude join table attributes
      },
      {
        model: ProposalFinanceTable,
        as: 'financeTable', // Include finance table
        include: [
          {
            model: ProposalFinanceTableItem, // Include items within the finance table
            as: 'items'
          }
        ]
      }
      // {
      //   model: ProposalContent,
      //   as: 'contents',
      //   include: [
      //     {
      //       model: ProposalFinanceTable,
      //       as: 'financeTable', // Include finance table
      //       include: [
      //         {
      //           model: ProposalFinanceTableItem, // Include items within the finance table
      //           as: 'items'
      //         }
      //       ]
      //     },
      //     {
      //       model: ProposalContent,
      //       as: 'children' // Include children of ProposalContent
      //     }
      //   ]
      // }
    ]);

    // Convert to JSON to ensure all nested associations are plain objects
    let proposalData = proposal?.toJSON();

    // Dynamically determine the related entity and assign it
    proposalData.relatedEntity =
      proposalData.opportunity || proposalData.deal || proposalData.project
        ? {
            id: proposalData.opportunity?.id || proposalData.deal?.id || proposalData.project?.id,
            name: proposalData.opportunity?.name || proposalData.deal?.name || proposalData.project?.name
          }
        : null;

    // Remove raw related entity fields
    delete proposalData.opportunity;
    delete proposalData.deal;
    delete proposalData.project;

    // // Build a hierarchical structure for contents
    // const contents = proposalData.contents || [];
    // const nestedContents = this.buildHierarchy(contents, null, '', { value: 1 });

    // // Create the final formatted proposal object
    // return {
    //   ...proposalData,
    //   contents: nestedContents
    // };
    return proposalData;
  }

  private buildHierarchy(contents: ProposalContent[], parentId: string | null = null, prefix: string = '', tocCounter: { value: number }): any[] {
    return contents
      .filter(content => content.parentId === parentId)
      .map((content, index) => {
        const toc = prefix ? parseFloat(`${prefix}.${index + 1}`) : tocCounter.value++;
        return {
          toc,
          ...content,
          children: this.buildHierarchy(contents, content.id, toc.toString(), tocCounter)
        };
      });
  }

  public async proposalOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<Proposal> {
    const proposal = await Proposal.findOne({ where: filter, include: joinedTables || [] });
    if (!proposal) throw new BaseError(ERRORS.PROPOSAL_NOT_FOUND);
    return proposal;
  }

  public async validateProposalAccess(proposalId: string, user: User): Promise<void> {
    if (user.role.permissions.includes(ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS)) return;

    const isAssigned = await this.isUserAssignedToProposal(proposalId, user.id);
    if (!isAssigned) throw new BaseError(ERRORS.ACCESS_DENIED);
  }

  private async isUserAssignedToProposal(proposalId: string, userId: number): Promise<boolean> {
    const assignment = await ProposalUsers.findOne({ where: { proposalId, userId } });
    return !!assignment; // Returns true if assigned, false otherwise
  }

  public async sendProposalsExcelByEmail(query: any, user: User, email: string): Promise<void> {
    const where: any = {
      ...(query.relatedEntityId && { relatedEntityId: query.relatedEntityId }),
      ...(query.searchKey && {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query.searchKey}%` } },
          { reference: { [Op.iLike]: `%${query.searchKey}%` } },
          { version: { [Op.iLike]: `%${query.searchKey}%` } },
          { proposalFor: { [Op.iLike]: `%${query.searchKey}%` } }
        ]
      }),
      ...(query.status?.length && {
        status: { [Op.in]: query.status }
      }),
      ...(query.type?.length && {
        type: { [Op.in]: query.type }
      }),
      ...((query.fromDate || query.toDate) && {
        createdAt: {
          ...(query.fromDate && { [Op.gte]: new Date(query.fromDate) }),
          ...(query.toDate && { [Op.lte]: new Date(query.toDate) })
        }
      })
    };

    if (!user.role.permissions.includes(ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS)) {
      where['$users.id$'] = user.id;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Proposals');

    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Version', key: 'version', width: 15 },
      { header: 'Reference', key: 'reference', width: 20 },
      { header: 'Proposal For', key: 'proposalFor', width: 25 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Proposal Date', key: 'proposalDate', width: 20 },
      { header: 'Related Entity', key: 'relatedEntityName', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const proposals = await Proposal.findAll({
        where,
        include: [
          {
            model: Opportunity,
            as: 'opportunity',
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Deal,
            as: 'deal',
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: User,
            as: 'users',
            attributes: ['id', 'name'],
            through: { attributes: [] }, // Exclude join table attributes
            required: query.userId ? true : false, // Ensure filtering only when assignedUserId exists
            where: query.userId ? { id: query.userId } : undefined
          }
        ],
        limit: batchSize,
        offset,
        attributes: ['title', 'version', 'reference', 'proposalFor', 'type', 'status', 'proposalDate', 'createdAt']
      });

      for (const proposal of proposals) {
        const relatedEntity = proposal.opportunity?.name || proposal.deal?.name || proposal.project?.name || '';
        worksheet.addRow({
          title: proposal.title,
          version: proposal.version,
          reference: proposal.reference,
          proposalFor: proposal.proposalFor,
          type: proposal.type,
          status: proposal.status,
          proposalDate: proposal.proposalDate,
          relatedEntityName: relatedEntity,
          createdAt: proposal.createdAt
        });
      }

      hasMore = proposals.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Proposals Export',
      text: 'Please find attached the Excel file containing the filtered proposals.',
      attachment: {
        name: 'proposals.xlsx',
        content: attachment
      }
    });
  }
}

export default new ProposalService();
