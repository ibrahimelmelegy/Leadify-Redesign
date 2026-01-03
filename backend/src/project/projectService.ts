import { Includeable, Op, Sequelize, WhereOptions } from 'sequelize';
import Asset from '../asset/assetModel';
import { sequelize } from '../config/db';
import { LeadStatusEnums, SortEnum } from '../lead/leadEnum';
import leadService from '../lead/leadService';
import { AdditionalMaterial, AdditionalMaterialItem } from '../additionalMaterial/model/additional-material.model';
import { OpportunityStageEnums } from '../opportunity/opportunityEnum';
import opportunityService from '../opportunity/opportunityService';
import ProjectAsset from '../projectAsset/projectAssetModel';
import ProjectManpower from '../projectManpower/projectManpowerModel';
import Service from '../service/serviceModel';
import uploaderService from '../uploader/uploader.service';
import User from '../user/userModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { Vehicle } from '../vehicle/vahicle.model';
import { AssociatingManpowerToProjectInput } from './inputs/associatingManpowerInput';
import { completeProjectCreationInput } from './inputs/completeProjectCreationInput';
import { CreateProjectInput } from './inputs/create-project.input';
import EtimadProject from './models/etimadProjectModel';
import Project from './models/projectModel';
import { ProjectCategoryEnum, ProjectSortByEnum } from './projectEnum';
import { AssociatingVehiclesToProjectInput } from './inputs/associatingVehiclesInput';
import Manpower from '../manpower/manpowerModel';
import { AssociatingAssetToProjectInput } from './inputs/associatingAssetInput';
import { AssociatingMaterialsToProjectInput } from './inputs/associatingMaterialsInput';
import ProjectMaterial from './models/peojectMaterial';
import ProjectAdditionalMaterialItem from './models/projectAdditionalMaterialItem';
import Client from '../client/clientModel';
import { createActivityLog } from '../activity-logs/activityService';
import { ProjectPermissionsEnum } from '../role/roleEnum';
import clientService from '../client/clientService';
import UserProjects from './models/projectUsersModel';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';
import dealService from '../deal/dealService';
import { DealStageEnums } from '../deal/dealEnum';
import notificationService from '../notification/notificationService';
import { Material } from '../material/material.model';

const RelationArray = [
  Vehicle,
  {
    model: User,
    as: 'assignedUsers',
    attributes: ['id', 'name']
  },
  EtimadProject,
  Client,
  { model: Material, include: [AdditionalMaterial, Service] },
  {
    model: ProjectManpower,
    include: [
      {
        model: Manpower,
        as: 'manpower',
        attributes: ['name', 'phone']
      }
    ]
  },
  {
    model: ProjectAdditionalMaterialItem,
    include: [
      {
        model: AdditionalMaterialItem
      }
    ]
  },
  { model: ProjectAsset, include: [Asset] }
];
class ProjectService {
  async createProject(input: CreateProjectInput, admin: User) {
    let existingProject: Project | null;
    if (input.projectId) {
      existingProject = await Project.findOne({
        where: {
          id: input.projectId
        }
      });
    } else {
      existingProject = await Project.findOne({
        where: {
          isCompleted: false
        },
        attributes: ['isCompleted', 'id']
      });
    }
    if (input.basicInfo.clientId) await clientService.clientOrError({ id: input.basicInfo.clientId });
    // Start a transaction to ensure atomicity
    const transaction = await sequelize.transaction();

    try {
      // Fetch users based on input IDs
      const users = await User.findAll({
        where: {
          id: { [Op.in]: input.basicInfo.assignedUsersIds }
        }
      });
      if (!input.projectId) {
        if (input.basicInfo.leadId) await this.convertLeadToProject(input.basicInfo.leadId);
        if (input.basicInfo.dealId) await this.convertDealToProject(input.basicInfo.dealId);
        if (input.basicInfo.opportunityId) await this.convertOpportunityToProject(input.basicInfo.opportunityId);
      }

      // Create the project
      let project = !existingProject ? await Project.create({ ...input.basicInfo }, { transaction }) : existingProject.set({ ...input.basicInfo });
      existingProject && (await project.save());

      if (input.basicInfo.files?.length) {
        await uploaderService.setFileReferences(input.basicInfo.files.map(file => file.refs).flat(1));
        project.files?.length && (await uploaderService.removeFileReferences(project.files.map(file => file.refs).flat(1)));
      }

      // Add relation to the project
      await project.$set('assignedUsers', users, { transaction });
      if (users?.length) {
        users.forEach(async (item: User) => {
          await notificationService.sendAssignProjectNotification({ userId: item.id, target: project.id }, project, admin);
        });
      }
      if (input.basicInfo.category === ProjectCategoryEnum.Etimad) {
        if (existingProject) {
          await EtimadProject.destroy({ where: { projectId: project.id } });
        }
        await EtimadProject.create({ ...input.basicInfo.etimadInfo, projectId: project.id }, { transaction });
      }

      // Commit the transaction
      await transaction?.commit();
      !input?.projectId && (await createActivityLog('project', 'create', project.id, admin.id, null, 'Prject created Successfully'));
      // Return the created project with relations
      return await Project.findByPk(project.id, {
        include: RelationArray
      });
    } catch (error) {
      console.log(error);
      await transaction?.rollback();
      throw new BaseError((ERRORS[(<any>error).message] as any) || ERRORS.SOMETHING_WENT_WRONG);
    }
  }

  public async associatingVehicles(id: string, input: AssociatingVehiclesToProjectInput, user: User): Promise<any> {
    await this.validateProjectAccess(id, user);
    const project = await this.projectOrError({ id });
    if (!input.vehiclesIds) {
      await project.update({
        totalCarRent: 0,
        totalCarRentPerDuration: 0
      });
      return project;
    }

    // Fetch vehicles based on input IDs
    const vehicles = await Vehicle.findAll({
      where: {
        id: { [Op.in]: input.vehiclesIds }
      }
    });

    // Validate if all vehicles exist
    if (vehicles.length !== input.vehiclesIds.length) throw new BaseError(ERRORS.VEHICLE_NOT_FOUND);

    // Calculate totalCarRent
    const totalCarRent = vehicles.reduce(
      (sum, vehicle) => sum + (Number(vehicle.rentCost) + Number(vehicle.gasCost) + Number(vehicle.oilCost) + Number(vehicle.regularMaintenanceCost)),
      0
    );

    // Calculate totalCarRentPerDuration
    const totalCarRentPerDuration = (totalCarRent / 30) * project.duration; // Add relation to the project

    await project.$set('vehicles', vehicles);

    // Update project's totalCarRent
    await project.update({
      totalCarRent: parseFloat(totalCarRent.toFixed(2)),
      totalCarRentPerDuration: parseFloat(totalCarRentPerDuration.toFixed(2))
    });

    // Log activity if the project is completed
    if (project.isCompleted) {
      await createActivityLog('project', 'update', project.id, user.id, null, 'Project vehicles got updated successfully');
    }

    return this.recalculateProject(project);
  }

  public async associatingManpower(id: string, data: AssociatingManpowerToProjectInput, user: User): Promise<any> {
    await this.validateProjectAccess(id, user);

    const project = await this.projectOrError({ id });
    const { accommodationCost, foodCostPerDay, managementAdditionPercentage = 0 } = data;

    await project.update({
      accommodationCost,
      foodCostPerDay,
      managementAdditionPercentage
    });
    project.isCompleted && (await createActivityLog('project', 'update', project.id, user.id, null, 'Prject manpower got updated Successfully'));

    return this.recalculateProject(project);
  }

  public async associateingMaterial(id: string, input: AssociatingMaterialsToProjectInput, user: User): Promise<any> {
    await this.validateProjectAccess(id, user);

    const project = await this.projectOrError({ id });

    const transaction = await sequelize.transaction();

    const materialIds = new Set(input.materialsIds);

    // Fetch materials based on input IDs
    const materials = await Material.findAll({
      where: {
        id: { [Op.in]: [...materialIds] }
      },
      include: [AdditionalMaterial, Service]
    });
    if (materials.length !== materialIds.size) throw new BaseError(ERRORS.MATERIAL_NOT_FOUND);

    const additionalMaterialItemIds = new Set(
      Object.values(input.additionalMaterialItems)
        .map(e => e.map(x => x.id))
        .flat()
    );
    const additionalMaterialItem = await AdditionalMaterialItem.findAll({
      where: {
        id: { [Op.in]: [...additionalMaterialItemIds] }
      }
    });

    if (additionalMaterialItem.length !== additionalMaterialItemIds.size) throw new BaseError(ERRORS.ADDITIONAL_MATERIAL_NOT_FOUND);

    try {
      let materialsTotalMaterialCost = 0;
      const materialMppedData = materials.map(material => {
        const additionalItems = input.additionalMaterialItems[material.additionalMaterialId] ?? [];

        const additionalMaterial = additionalItems.map(e => {
          const item = additionalMaterialItem?.find(f => f.id === e.id);
          const quantity = Number(e.quantity);
          const unitPrice = Number(item?.price ?? 0);
          return {
            ...e,
            quantity,
            price: quantity * unitPrice
          };
        });

        const totalAdditionalCost = additionalMaterial.reduce((acc, i) => acc + Number(i.price), 0);

        const totalQuantityForGroup = materials
          .filter(e => e.additionalMaterialId === material.additionalMaterialId)
          .reduce((acc, i) => acc + Number(i.quantity), 0);
        const additionalMaterialCost = totalQuantityForGroup > 0 ? totalAdditionalCost / totalQuantityForGroup : 0;
        const unitPrice = Number(material.unitPrice);
        const margin = Number(input.materialMargin);
        const servicePrice = Number(material.service?.price ?? 0);
        const materialQuantity = Number(material.quantity);
        const marginCommission = (unitPrice + additionalMaterialCost) * (margin / 100);
        const materialCost = unitPrice + additionalMaterialCost + marginCommission + servicePrice;
        const totalMaterialCost = materialCost * materialQuantity;
        materialsTotalMaterialCost += totalMaterialCost;

        return {
          projectId: project.id,
          materialId: material.id,
          additionalMaterialPrice: additionalMaterialCost,
          marginCommission,
          materialCost,
          totalMaterialCost
        };
      });

      // update project material margin
      project.set({ materialMargin: input.materialMargin, totalMaterialCost: materialsTotalMaterialCost });
      await project.save({ transaction });

      await ProjectMaterial.destroy({
        where: {
          projectId: project.id
        },
        transaction
      });

      await ProjectMaterial.bulkCreate(materialMppedData, { transaction });

      await ProjectAdditionalMaterialItem.destroy({
        where: {
          projectId: project.id
        },
        transaction
      });
      await ProjectAdditionalMaterialItem.bulkCreate(
        Object.values(input.additionalMaterialItems)
          .flat(1)
          .map(e => ({ quantity: e.quantity, projectId: project.id, additionalMaterialItemId: e.id })),
        { transaction }
      );

      transaction.commit();
      project.isCompleted && (await createActivityLog('project', 'update', project.id, user.id, null, 'Prject materials got updated Successfully'));

      return this.recalculateProject(project);
    } catch (error) {
      console.log(error);

      transaction.rollback();
      throw new BaseError(ERRORS.SOMETHING_WENT_WRONG);
    }
  }

  public async associateAssetsToProject(id: string, input: AssociatingAssetToProjectInput, user: User): Promise<any> {
    await this.validateProjectAccess(id, user);

    const project = await this.projectOrError({ id });

    // Validate asset existence.
    const assets = await Asset.findAll({ where: { id: input.assetIds } });
    if (assets.length !== input.assetIds.length) throw new BaseError(ERRORS.ASSET_NOT_FOUND);

    // Fetch existing project assets
    const existingProjectAssets = await ProjectAsset.findAll({ where: { projectId: project.id } });
    const existingAssetIds = new Set(existingProjectAssets.map(pa => pa.assetId));

    // Determine assets to remove (not in input.assetIds)
    const assetsToRemove = existingProjectAssets.filter(pa => !input.assetIds.includes(pa.assetId));

    // Remove assets that are no longer associated
    if (assetsToRemove.length > 0) {
      await ProjectAsset.destroy({
        where: {
          projectId: project.id,
          assetId: assetsToRemove.map(pa => pa.assetId)
        }
      });
    }

    // Determine new assets to add (not in DB)
    const newAssets = assets.filter(asset => !existingAssetIds.has(asset.id));

    // Add new associations
    await Promise.all(
      newAssets.map(asset =>
        ProjectAsset.create({
          projectId: project.id,
          assetId: asset.id,
          rentPrice: asset.rentPrice,
          buyPrice: asset.buyPrice
        })
      )
    );

    // Recalculate total costs
    const updatedProjectAssets = await ProjectAsset.findAll({ where: { projectId: project.id } });
    const totalAssetRentPrice = updatedProjectAssets.reduce((sum, asset) => sum + (asset.rentPrice || 0), 0);
    const totalAssetBuyPrice = updatedProjectAssets.reduce((sum, asset) => sum + (asset.buyPrice || 0), 0);
    const totalAssetsCost = totalAssetRentPrice + totalAssetBuyPrice;

    // Update project with new totals
    await project.update({
      totalAssetRentPrice,
      totalAssetBuyPrice,
      totalAssetsCost
    });

    // Log update if project is completed
    if (project.isCompleted) await createActivityLog('project', 'update', project.id, user.id, null, 'Project assets updated successfully');

    // Recalculate full project costs
    return this.recalculateProject(project);
  }

  public async completeProjectCreation(projectId: string, input: completeProjectCreationInput, user: User): Promise<any> {
    await this.validateProjectAccess(projectId, user);

    const project = await this.projectOrError({ id: projectId });
    const grandTotal = project.manpowerTotalCost + project.totalMaterialCost + project.totalAssetsCost;

    // Calculate VAT (15%)
    const vat = parseFloat((grandTotal * 0.15).toFixed(2));

    const { discount, marginPercentage } = input;

    const marginAmount = (grandTotal * marginPercentage) / 100;
    // Calculate final project cost
    const totalCost = grandTotal + vat - discount + marginAmount;
    await project.update({
      isCompleted: true,
      discount,
      vat: parseFloat(vat.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      marginPercentage,
      marginAmount: parseFloat(marginAmount.toFixed(2))
    });
    return project;
  }

  public async getProjects(query: any, user: User): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    if (!user.role.permissions.includes(ProjectPermissionsEnum.VIEW_GLOBAL_PROJECTS)) query.userId = user.id;

    const { rows: projects, count: totalItems } = await Project.findAndCountAll({
      where: {
        isCompleted: true,
        ...(query.searchKey && { [Op.or]: [{ name: { [Op.iLike]: `%${query.searchKey}%` } }] }),
        ...((query.fromStartDate || query.toStartDate) && {
          startDate: {
            ...(query.fromStartDate && { [Op.gte]: new Date(query.fromStartDate) }),
            ...(query.toStartDate && { [Op.lte]: new Date(query.toStartDate) })
          }
        }),
        ...((query.fromEndDate || query.toEndDate) && {
          endDate: {
            ...(query.fromEndDate && { [Op.gte]: new Date(query.fromEndDate) }),
            ...(query.toEndDate && { [Op.lte]: new Date(query.toEndDate) })
          }
        }),
        ...(query.status &&
          query.status.length > 0 && {
            status: {
              [Op.in]: query.status
            }
          }),
        ...(query.type &&
          query.type.length > 0 && {
            status: {
              [Op.in]: query.type
            }
          }),
        ...(query.category &&
          query.category.length > 0 && {
            category: {
              [Op.in]: query.category
            }
          })
      },
      limit,
      offset,
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'clientName']
        },
        {
          model: User,
          as: 'assignedUsers',
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] }, // Exclude join table attributes
          ...(query.userId && {
            required: true, // <-- THIS is crucial to apply WHERE in count query
            where: { id: query.userId }
          })
        }
      ],
      order: [
        [
          query.sortBy && Object.keys(ProjectSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
          query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
        ]
      ]
    });

    return {
      docs: projects,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async getProjectById(projectId: string, user: User): Promise<any> {
    await this.validateProjectAccess(projectId, user);
    const project = await this.projectOrError({ id: projectId }, RelationArray);

    return project;
  }

  public async getDraftProject(): Promise<any> {
    const project = await this.projectOrError(
      {
        isCompleted: false
      },
      RelationArray
    );
    const step = project.materialMargin
      ? 5
      : project.projectAssets.length
      ? 6
      : project.projectManpowerResources.length
      ? 4
      : project.vehicles.length
      ? 3
      : 2;

    return { project, step }; //{ project: this.Mapper(project), step };
  }

  async projectOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<Project> {
    const project = await Project.findOne({ where: filter, include: joinedTables || [] });
    if (!project) throw new BaseError(ERRORS.PROJECT_NOT_FOUND);
    return project;
  }

  async convertLeadToProject(leadId: string): Promise<void> {
    const lead = await leadService.leadOrError({ id: leadId });
    if (lead.status === LeadStatusEnums.CONVERTED) throw new BaseError(ERRORS.LEAD_ALREADY_CONVERTED);
    await lead.update({ status: LeadStatusEnums.CONVERTED });
  }

  async convertDealToProject(dealId: string): Promise<void> {
    const deal = await dealService.dealOrError({ id: dealId });
    if (deal.stage === DealStageEnums.CONVERTED) throw new BaseError(ERRORS.DEAL_ALREADY_CONVERTED);
    await deal.update({ stage: DealStageEnums.CONVERTED });
  }

  async convertOpportunityToProject(opportunityId: string): Promise<void> {
    const opportunity = await opportunityService.opportunityOrError({ id: opportunityId });
    if (opportunity.stage === OpportunityStageEnums.CONVERTED) throw new BaseError(ERRORS.OPPORTUNITY_ALREADY_CONVERTED);
    await opportunity.update({ stage: OpportunityStageEnums.CONVERTED });
  }

  public async recalculateProject(project: Project): Promise<any> {
    const manpowerRecords = await ProjectManpower.findAll({ where: { projectId: project.id } });
    const resourceCount = manpowerRecords.length || 1;
    const accommodationCostPerManpower = project.accommodationCost / resourceCount;

    const carRentPerManpower = project.totalCarRentPerDuration / resourceCount;
    let manpowerTotalCost = 0;
    for (const manpower of manpowerRecords) {
      const foodAllowanceCost = project.foodCostPerDay * manpower.estimatedWorkDays;
      const totalCost =
        manpower.durationCost + foodAllowanceCost + manpower.accommodationCostPerManpower + manpower.carRentPerManpower + manpower.otherCosts;
      await manpower.update({
        totalCost: parseFloat(totalCost.toFixed(2)),
        foodAllowanceCost: parseFloat(foodAllowanceCost.toFixed(2)),
        accommodationCostPerManpower: parseFloat(accommodationCostPerManpower.toFixed(2)),
        carRentPerManpower: parseFloat(carRentPerManpower.toFixed(2))
      });
      manpowerTotalCost += totalCost;
    }

    const finalManpowerTotalCost = manpowerTotalCost + (manpowerTotalCost * project.managementAdditionPercentage) / 100;

    const grandTotal = finalManpowerTotalCost + project.totalMaterialCost + project.totalAssetsCost;

    const vat = parseFloat((grandTotal * 0.15).toFixed(2));

    const { discount, marginPercentage } = project;

    const marginAmount = (grandTotal * marginPercentage) / 100;
    const totalCost = grandTotal + vat - discount + marginAmount;
    await project.update({
      manpowerTotalCost: parseFloat(manpowerTotalCost.toFixed(2)),
      finalManpowerTotalCost: parseFloat(finalManpowerTotalCost.toFixed(2)),
      resourceCount,
      vat: parseFloat(vat.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      marginPercentage,
      marginAmount: parseFloat(marginAmount.toFixed(2))
    });
    return project;
  }

  async validateProjectAccess(projectId: string, user: User): Promise<void> {
    if (user.role.permissions.includes(ProjectPermissionsEnum.VIEW_GLOBAL_PROJECTS)) return;

    const isAssigned = await this.isUserAssignedToProject(projectId, user.id);
    if (!isAssigned) throw new BaseError(ERRORS.ACCESS_DENIED);
  }

  private async isUserAssignedToProject(projectId: string, userId: number): Promise<boolean> {
    const assignment = await UserProjects.findOne({ where: { projectId, userId } });
    return !!assignment; // Returns true if assigned, false otherwise
  }

  public async deleteProject(id: string, user: User): Promise<any> {
    await this.validateProjectAccess(id, user);
    const project = await this.projectOrError({ id });
    if (project.isCompleted) throw new BaseError(ERRORS.INVALID_DELETE_COMPLETED_PROJECT);
    await project.destroy();
  }

  public async sendProjectsExcelByEmail(query: any, user: User, email: string): Promise<void> {
    const where: any = {
      isCompleted: true,
      ...(query.searchKey && {
        [Op.or]: [{ name: { [Op.iLike]: `%${query.searchKey}%` } }]
      }),
      ...(query.status?.length && {
        status: { [Op.in]: query.status }
      }),
      ...(query.type?.length && {
        type: { [Op.in]: query.type }
      }),
      ...(query.fromStartDate || query.toStartDate
        ? {
            startDate: {
              ...(query.fromStartDate && { [Op.gte]: new Date(query.fromStartDate) }),
              ...(query.toStartDate && { [Op.lte]: new Date(query.toStartDate) })
            }
          }
        : {}),
      ...(query.fromEndDate || query.toEndDate
        ? {
            endDate: {
              ...(query.fromEndDate && { [Op.gte]: new Date(query.fromEndDate) }),
              ...(query.toEndDate && { [Op.lte]: new Date(query.toEndDate) })
            }
          }
        : {}),
      ...(query.category &&
        query.category.length > 0 && {
          category: {
            [Op.in]: query.category
          }
        })
    };

    if (!user.role.permissions.includes(ProjectPermissionsEnum.VIEW_GLOBAL_PROJECTS)) {
      where['$assignedUsers.id$'] = user.id;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Projects');

    worksheet.columns = [
      { header: 'Project Name', key: 'name', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Start Date', key: 'startDate', width: 20 },
      { header: 'End Date', key: 'endDate', width: 20 },
      { header: 'Client', key: 'clientName', width: 30 },
      { header: 'Assigned Users', key: 'assignedUsers', width: 40 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const projects = await Project.findAll({
        where,
        limit: batchSize,
        offset,
        include: [
          {
            model: Client,
            as: 'client',
            attributes: ['clientName']
          },
          {
            model: User,
            as: 'assignedUsers',
            attributes: ['id', 'name'],
            through: { attributes: [] }, // Exclude join table attributes
            required: query.userId ? true : false, // Ensure filtering only when assignedUserId exists
            where: query.userId ? { id: query.userId } : undefined
          }
        ]
      });

      for (const project of projects) {
        const assignedUsers = project.assignedUsers?.map((u: any) => u.name).join(', ') || '';
        worksheet.addRow({
          name: project.name,
          status: project.status,
          type: project.type,
          startDate: project.startDate,
          endDate: project.endDate,
          clientName: project.client?.clientName || '',
          assignedUsers,
          createdAt: project.createdAt
        });
      }

      hasMore = projects.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Projects Export',
      text: 'Attached is the Excel file with filtered completed projects.',
      attachment: {
        name: 'projects.xlsx',
        content: attachment
      }
    });
  }
}

export default new ProjectService();
