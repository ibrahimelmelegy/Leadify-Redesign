import { Op } from 'sequelize';
import { SortEnum } from '../lead/leadEnum';
import { IPaginationRes } from '../types';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { CreateVehicleInput, UpdateVehicleInput } from './inputs/create-vehicle.input';
import { GetPaginatedVehicleInput } from './inputs/paginated-vehicle.input';
import { Vehicle } from './vahicle.model';
import { VehicleSortByEnum } from './vehivle.enum';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';

class VehicleService {
  public async createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
    const existingVehicle = await Vehicle.findOne({
      where: {
        plate: input.plate
      }
    });
    if (existingVehicle) {
      throw new BaseError(ERRORS.VEHICLE_ALREADY_EXIST);
    }

    return Vehicle.create({ ...input });
  }

  public async getVehicles(input: GetPaginatedVehicleInput): Promise<IPaginationRes<Vehicle>> {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const offset = (page - 1) * limit;

    const { rows: vehicles, count: totalItems } = await Vehicle.findAndCountAll({
      where: {
        ...(input.searchKey && {
          [Op.or]: [
            {
              plate: {
                [Op.iLike]: `%${input.searchKey}%`
              }
            }
          ]
        }),
        ...(input.manufacturer &&
          input.manufacturer.length > 0 && {
            manufacturer: {
              [Op.in]: input.manufacturer // Matches any value in the array
            }
          }),
        ...((input.fromRentCost || input.toRentCost) && {
          rentCost: {
            ...(input.fromRentCost && { [Op.gte]: input.fromRentCost }),
            ...(input.toRentCost && { [Op.lte]: input.toRentCost })
          }
        }),
        ...((input.fromGasCost || input.toGasCost) && {
          gasCost: {
            ...(input.fromGasCost && { [Op.gte]: input.fromGasCost }),
            ...(input.toGasCost && { [Op.lte]: input.toGasCost })
          }
        }),
        ...((input.fromOilCost || input.toOilCost) && {
          oilCost: {
            ...(input.fromOilCost && { [Op.gte]: input.fromOilCost }),
            ...(input.toOilCost && { [Op.lte]: input.toOilCost })
          }
        }),

        ...((input.fromRegularMaintenanceCost || input.toRegularMaintenanceCost) && {
          regularMaintenanceCost: {
            ...(input.fromRegularMaintenanceCost && { [Op.gte]: input.fromRegularMaintenanceCost }),
            ...(input.toRegularMaintenanceCost && { [Op.lte]: input.toRegularMaintenanceCost })
          }
        })
      },
      include: [],
      limit,
      offset,
      order: [
        [
          input.sortBy && Object.keys(VehicleSortByEnum).includes(input.sortBy) ? input.sortBy : 'createdAt',
          input.sort && Object.values(SortEnum).includes(input.sort) ? input.sort : SortEnum.DESC
        ]
      ]
    });

    return {
      docs: vehicles,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public async getVehicle(id: string): Promise<Vehicle> {
    try {
      const vehicle = await Vehicle.findByPk(id, {});
      if (!vehicle) throw new BaseError(ERRORS.VEHICLE_NOT_FOUND);
      return vehicle;
    } catch (error) {
      throw new BaseError(ERRORS.VEHICLE_NOT_FOUND);
    }
  }

  public async updateVehicle(input: UpdateVehicleInput): Promise<Vehicle> {
    const { vehicleId, ...payload } = input;
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) throw new BaseError(ERRORS.VEHICLE_NOT_FOUND);
    const existingVehicle = await Vehicle.findOne({
      where: {
        id: {
          [Op.ne]: vehicleId
        },
        plate: payload.plate
      }
    });
    console.log(existingVehicle);

    if (existingVehicle) throw new BaseError(ERRORS.VEHICLE_ALREADY_EXIST);
    vehicle.set({ ...payload });

    return vehicle.save();
  }

  public async sendVehiclesExcelByEmail(query: GetPaginatedVehicleInput, email: string): Promise<void> {
    const where: any = {
      ...(query.searchKey && {
        [Op.or]: [
          {
            plate: {
              [Op.iLike]: `%${query.searchKey}%`
            }
          }
        ]
      }),
      ...(query.manufacturer &&
        query.manufacturer.length > 0 && {
          manufacturer: {
            [Op.in]: query.manufacturer // Matches any value in the array
          }
        }),
      ...(query.fromRentCost || query.toRentCost
        ? {
            rentCost: {
              ...(query.fromRentCost && { [Op.gte]: query.fromRentCost }),
              ...(query.toRentCost && { [Op.lte]: query.toRentCost })
            }
          }
        : {}),
      ...(query.fromGasCost || query.toGasCost
        ? {
            gasCost: {
              ...(query.fromGasCost && { [Op.gte]: query.fromGasCost }),
              ...(query.toGasCost && { [Op.lte]: query.toGasCost })
            }
          }
        : {}),
      ...(query.fromOilCost || query.toOilCost
        ? {
            oilCost: {
              ...(query.fromOilCost && { [Op.gte]: query.fromOilCost }),
              ...(query.toOilCost && { [Op.lte]: query.toOilCost })
            }
          }
        : {}),
      ...(query.fromRegularMaintenanceCost || query.toRegularMaintenanceCost
        ? {
            regularMaintenanceCost: {
              ...(query.fromRegularMaintenanceCost && { [Op.gte]: query.fromRegularMaintenanceCost }),
              ...(query.toRegularMaintenanceCost && { [Op.lte]: query.toRegularMaintenanceCost })
            }
          }
        : {})
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vehicles');

    worksheet.columns = [
      { header: 'Manufacturer', key: 'manufacturer', width: 25 },
      { header: 'Rent Cost', key: 'rentCost', width: 15 },
      { header: 'Gas Cost', key: 'gasCost', width: 15 },
      { header: 'Oil Cost', key: 'oilCost', width: 15 },
      { header: 'Maintenance Cost', key: 'regularMaintenanceCost', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const vehicles = await Vehicle.findAll({
        where,
        raw: true,
        limit: batchSize,
        offset,
        order: [
          [
            query.sortBy && Object.keys(VehicleSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
            query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
          ]
        ]
      });

      for (const vehicle of vehicles) {
        worksheet.addRow({
          manufacturer: vehicle.manufacturer,
          rentCost: vehicle.rentCost,
          gasCost: vehicle.gasCost,
          oilCost: vehicle.oilCost,
          regularMaintenanceCost: vehicle.regularMaintenanceCost,
          createdAt: vehicle.createdAt
        });
      }

      hasMore = vehicles.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Vehicles Export',
      text: 'Attached is the Excel file containing the filtered vehicle data.',
      attachment: {
        name: 'vehicles.xlsx',
        content: attachment
      }
    });
  }
}

export default new VehicleService();
