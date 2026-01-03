import Client from '../client/clientModel';
import Deal from '../deal/model/dealModel';
import { SortEnum } from '../lead/leadEnum';
import Opportunity from '../opportunity/opportunityModel';
import Project from '../project/models/projectModel';
import Proposal from '../proposal/models/proposalModel';
import User from '../user/userModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { NotificationReadEnums, NotificationTypeEnums } from './notificationEnum';
import Notification from './notificationModel';

class NotificationService {
  async getNotifications(input: any, user: User): Promise<any> {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const offset = (page - 1) * limit;
    const { rows: notifications, count: totalItems } = await Notification.findAndCountAll({
      where: { userId: user?.id },
      limit,
      offset,
      order: [['createdAt', SortEnum.DESC]]
    });
    const unreadNotificationsCount = await Notification.count({
      where: { userId: user?.id, read: NotificationReadEnums.UN_READ }
    });

    return {
      unreadNotificationsCount,
      docs: notifications,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  async updateNotificationsToRead(user: User): Promise<any> {
    await Notification.update(
      { read: NotificationReadEnums.READ },
      {
        where: { userId: user.id, read: NotificationReadEnums.UN_READ }
      }
    );
  }

  async updateNotificationToClicked(id: string, user: User): Promise<any> {
    const notifacation = await Notification.findOne({
      where: { userId: user.id, id }
    });
    if (!notifacation) throw new BaseError(ERRORS.NOTIFICATION_NOT_FOUND);
    notifacation.read = NotificationReadEnums.CLICKED;
    await notifacation.save();
  }

  async sendAssignLeadNotificatiom(input: any): Promise<any> {
    const notification = await Notification.create({
      ...input,
      body_en: 'New Lead assigned to you.',
      body_ar: 'New Lead assigned to you.',
      type: NotificationTypeEnums.LEAD_ASSIGNED
    });
  }

  async sendAssignOpportunityNotification(input: any, opportunity: Opportunity, admin: User): Promise<any> {
    await Notification.create({
      ...input,
      body_en: `The Opportunity ${opportunity.name} at stage ${opportunity.stage}. Assigned by ${admin.name}.`,
      body_ar: `The Opportunity ${opportunity.name} at stage ${opportunity.stage}. Assigned by ${admin.name}.`,
      type: NotificationTypeEnums.OPPORTUNITY_ASSIGNED
    });
  }

  async sendProposalAssignUsersNotification(proposal: Proposal, users: number[]): Promise<any> {
    for (const user of users) {
      await Notification.create({
        userId: user,
        target: proposal.id,
        body_en: `Proposal ${proposal.title} assigned to you.`,
        body_ar: `Proposal ${proposal.title} assigned to you.`,
        type: NotificationTypeEnums.PROPOSAL_ASSIGNED
      });
    }
  }

  async sendApproveProposalNotification(proposal: Proposal): Promise<any> {
    for (const user of proposal.users) {
      await Notification.create({
        userId: user.id,
        target: proposal.id,
        body_en: `Proposal ${proposal.title} has been approved.`,
        body_ar: `Proposal ${proposal.title} has been approved.`,
        type: NotificationTypeEnums.PROPOSAL_APPROVED
      });
    }
  }

  async sendRejectProposalNotification(proposal: Proposal): Promise<any> {
    for (const user of proposal.users) {
      await Notification.create({
        userId: user.id,
        target: proposal.id,
        body_en: `Proposal ${proposal.title} has been rejected.`,
        body_ar: `Proposal ${proposal.title} has been rejected.`,
        type: NotificationTypeEnums.PROPOSAL_REJECTED
      });
    }
  }

  async sendAssignDealNotification(input: any, deal: Deal, admin: User): Promise<any> {
    const companyName = deal.companyName;
    const dealInfo = companyName ? `The Deal ${deal.name} for ${companyName} at stage ${deal.stage}` : `The Deal ${deal.name} at stage ${deal.stage}`;

    const message = `${dealInfo}. Assigned by ${admin.name}.`;

    await Notification.create({
      ...input,
      body_en: message,
      body_ar: message,
      type: NotificationTypeEnums.DEAL_ASSIGNED
    });
  }

  async sendAssignProjectNotification(input: any, project: Project, admin: User): Promise<any> {
    const category = project.category || 'Project';
    const clientName = project.client?.clientName || 'Unknown Client';
    const message = `The ${category} ${project.name} for Client ${clientName}. Assigned by ${admin.name}.`;

    await Notification.create({
      ...input,
      body_en: message,
      body_ar: message, // You can localize this to Arabic if needed
      type: NotificationTypeEnums.PROJECT_ASSIGNED
    });
  }

  async sendAssignClientNotification(input: any, client: Client, admin: User): Promise<any> {
    const clientType = client.clientType || 'Client';
    const clientName = client.clientName;
    const companyName = client.companyName;

    const message = companyName
      ? `The ${clientType} ${clientName} represents ${companyName}. Assigned by ${admin.name}.`
      : `The ${clientType} ${clientName}. Assigned by ${admin.name}.`;

    await Notification.create({
      ...input,
      body_en: message,
      body_ar: message, // Replace with Arabic translation if needed
      type: NotificationTypeEnums.CLIENT_ASSIGNED
    });
  }
}

export default new NotificationService();
