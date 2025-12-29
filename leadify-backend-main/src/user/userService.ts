import { Includeable, Op, WhereOptions } from 'sequelize';
import User from './userModel';
import { UpdateUserInput } from './inputs/updateUserInput';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import bcrypt from 'bcryptjs';
import Role from '../role/roleModel';
import { getAllPermissions } from '../role/roleEnum';
import roleService from '../role/roleService';
import { SortEnum } from '../lead/leadEnum';
import { UserSortByEnum } from './userEnum';
import * as ExcelJS from 'exceljs';
import { sendEmail } from '../utils/emailHelper';
import uploaderService from '../uploader/uploader.service';

class UserService {
  public async createSuperAdmin(): Promise<User> {
    if (process.env.ALLOW_SUPER_ADMIN_CREATION != 'true') throw new BaseError(ERRORS.INVALID_PERMISSION);
    let role = await Role.findOne({ where: { name: 'Super Admin' } });
    if (!role) {
      const permissions = getAllPermissions();
      role = await Role.create({ name: 'Super Admin', permissions });
    }

    let superAdmin = await User.findOne({ where: { roleId: role.id } });
    if (!superAdmin)
      superAdmin = await User.create({
        name: 'Super Admin',
        email: 'admin@lead.com',
        password: await bcrypt.hash('123456', 10),
        roleId: role.id
      });
    return superAdmin;
  }

  /**
   * @desc Create a new user
   * @param data - User data
   * @returns Created user
   */
  public async createUser(data: any): Promise<User> {
    // Check if email is already taken
    await this.errorIfUserWithExistingEmail(data.email);
    if (data.roleId) await roleService.roleOrError({ id: data.roleId });

    // Hash the password before storing
    data.password = await bcrypt.hash(data.password, 10);
    if (data.profilePicture) await uploaderService.setFileReferences([data.profilePicture]);

    return await User.create(data);
  }

  /**
   * @desc Update user details
   * @param id - User ID
   * @param data - Updated user details
   * @returns Updated user
   */
  public async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.userOrError({ id });

    // Check if email is being updated and already exists
    if (data.email) await this.errorIfUserWithExistingEmail(data.email, user.id);
    if (data.roleId) await roleService.roleOrError({ id: data.roleId });

    // Hash new password if provided
    if (data.password) data.password = await bcrypt.hash(data.password, 10);

    await user.update(data);
    if (data.profilePicture) await uploaderService.setFileReferences([data.profilePicture]);
    return user;
  }

  /**
   * @desc Get all users with pagination
   * @param query - Query parameters for pagination and filtering
   * @returns Paginated users
   */
  public async getUsers(query: any): Promise<any> {
    const { page = 1, limit = 10, searchKey, status, roleId } = query;

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: users, count: totalItems } = await User.findAndCountAll({
      where: {
        ...(status && { status }),
        ...(roleId && { roleId }),
        ...(searchKey && {
          [Op.or]: [{ name: { [Op.iLike]: `%${searchKey}%` } }, { email: { [Op.iLike]: `%${searchKey}%` } }]
        })
      },
      limit: Number(limit),
      offset,
      order: [
        [
          query.sortBy && Object.keys(UserSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
          query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
        ]
      ],
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }]
    });

    return {
      docs: users,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  /**
   * @desc Get a user by ID
   * @param id - User ID
   * @returns User object
   */
  public async getUserById(id: string): Promise<User> {
    const user = await this.userOrError({ id }, [{ model: Role, as: 'role', attributes: ['id', 'name'] }]);

    return user;
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await this.userOrError({ id });
    await user.destroy();
  }

  /**
   * @desc Check if a user with the given email exists
   * @param email - Email to check
   * @param id - (Optional) User ID to exclude from check
   */
  private async errorIfUserWithExistingEmail(email: string, id?: number): Promise<void> {
    const existingUser = await User.findOne({ where: { email, ...(id && { id: { [Op.ne]: id } }) } });
    if (existingUser) throw new BaseError(ERRORS.EMAIL_ALREADY_EXISTS);
  }

  public async userOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<User> {
    const user = await User.findOne({ where: filter, include: joinedTables || [] });
    if (!user) throw new BaseError(ERRORS.USER_NOT_FOUND);
    return user;
  }

  public async sendUsersExcelByEmail(query: any, email: string): Promise<void> {
    const where: any = {
      ...(query.status && { status: query.status }),
      ...(query.roleId && { roleId: query.roleId }),
      ...(query.searchKey && {
        [Op.or]: [{ name: { [Op.iLike]: `%${query.searchKey}%` } }, { email: { [Op.iLike]: `%${query.searchKey}%` } }]
      })
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Role ID', key: 'roleId', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const users = await User.findAll({
        where,
        raw: true,
        limit: batchSize,
        offset,
        order: [
          [
            query.sortBy && Object.keys(UserSortByEnum).includes(query.sortBy) ? query.sortBy : 'createdAt',
            query.sort && Object.values(SortEnum).includes(query.sort) ? query.sort : SortEnum.DESC
          ]
        ]
      });

      for (const user of users) {
        worksheet.addRow({
          name: user.name,
          email: user.email,
          status: user.status,
          roleId: user.roleId,
          createdAt: user.createdAt
        });
      }

      hasMore = users.length === batchSize;
      offset += batchSize;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const attachment = Buffer.from(buffer).toString('base64');
    await sendEmail({
      to: email,
      subject: 'Users Export',
      text: 'Attached is the Excel file with all filtered users.',
      attachment: {
        name: 'users.xlsx',
        content: attachment
      }
    });
  }
}

export default new UserService();
