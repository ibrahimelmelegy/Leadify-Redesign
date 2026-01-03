import { Includeable, WhereOptions } from 'sequelize';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import uploaderService from '../uploader/uploader.service';
import ProposalContent from './proposalContentModel';
import proposalFinanceTableService from '../proposalFinanceTable/proposalFinanceTableService';
import proposalService from '../proposal/proposalService';
import User from '../user/userModel';
import proposalLogService from '../proposalLog/proposalLogService';
import { ProposalActionEnum } from '../proposalLog/proposalLogEnum';

class ProposalService {
  public async createProposalContent(data: any, user: User): Promise<ProposalContent> {
    await proposalService.validateProposalAccess(data.proposalId, user);
    await proposalService.proposalOrError({ id: data.proposalId });
    if (data.parentId) await this.contentOrError({ id: data.parentId });
    if (data.image) await uploaderService.setFileReferences([data.image]);
    // Create the main proposal content
    const content = await ProposalContent.create(data);

    // Handle financeTable creation if it exists
   // await proposalFinanceTableService.createFinanceTable(data, content, user);
    await proposalLogService.createProposalLog(user.id, content.proposalId, ProposalActionEnum.PROPOSAL_CONTENT_CREATED);
    return content;
  }

  public async updateProposalContent(id: string, data: any, user: User): Promise<ProposalContent> {
    const content = await this.contentOrError({ id });
    await proposalService.validateProposalAccess(content.proposalId, user);
    if (data.parentId) await this.contentOrError({ id: data.parentId });
    if (data.image) await uploaderService.setFileReferences([data.image]);
    await content.update(data);
    await proposalLogService.createProposalLog(user.id, content.proposalId, ProposalActionEnum.PROPOSAL_CONTENT_UPDATED);
    return content;
  }

  public async deleteProposalContent(id: string, user: User): Promise<void> {
    const content = await this.contentOrError({ id });
    await proposalService.validateProposalAccess(content.proposalId, user);
    await proposalLogService.createProposalLog(user.id, content.proposalId, ProposalActionEnum.PROPOSAL_CONTENT_DELETED);
    await content.destroy();
  }

  public async contentOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<ProposalContent> {
    const content = await ProposalContent.findOne({ where: filter, include: joinedTables || [] });
    if (!content) throw new BaseError(ERRORS.PROPOSAL_CONTENT_NOT_FOUND);
    return content;
  }
}

export default new ProposalService();
