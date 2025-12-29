import { Includeable, Op, WhereOptions } from 'sequelize';
import Role from './roleModel';
import { UpdateRoleInput } from './inputs/updateRoleInput';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { getAllPermissions, getPermissionsGroupedByName } from './roleEnum';
import { createRoleUserCountLoader } from './roleDataLoader';

class RoleService {
  public async createSuperAdminRole(): Promise<Role> {
    if (process.env.ALLOW_SUPER_ADMIN_CREATION != 'true') throw new BaseError(ERRORS.INVALID_PERMISSION);
    let role = await Role.findOne({ where: { name: 'Super Admin' } });
    if (!role) {
      const permissions = getAllPermissions();
      role = await Role.create({ name: 'Super Admin', permissions });
    }

    return role;
  }

  public async createRole(data: any): Promise<Role> {
    // Check if role with the same name already exists
    await this.errorIfRoleWithNameExists(data.name);

    return await Role.create(data);
  }

  /**
   * @desc Update an existing role
   * @param {string} id - Role ID
   * @param {UpdateRoleInput} data - Role update data
   * @returns {Promise<Role>}
   */
  public async updateRole(id: string, data: UpdateRoleInput): Promise<Role> {
    const role = await this.roleOrError({ id });
    // Check if new role name already exists (if updating name)
    if (data.name) await this.errorIfRoleWithNameExists(data.name, role.id);

    await role.update(data);
    return role;
  }

  /**
   * @desc Get all roles (with pagination & filtering)
   * @param {any} query - Query parameters (pagination & search)
   * @returns {Promise<any>}
   */
  public async getRoles(query: any): Promise<any> {
    const { page = 1, limit = 10, searchKey } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { rows: roles, count: totalItems } = await Role.findAndCountAll({
      where: {
        ...(searchKey && {
          [Op.or]: [{ name: { [Op.iLike]: `%${searchKey}%` } }]
        })
      },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['permissions'] }
    });

    // Extract role IDs for batch loading
    const roleIds = roles.map(role => role.id);

    // Batch load user counts for all roles
    const roleUserCountLoader = createRoleUserCountLoader();
    const userCounts = await roleUserCountLoader.loadMany(roleIds);
    // Attach totalAssignedUsers to each role
    const rolesWithUserCount = roles.map((role, index) => ({
      ...role.get({ plain: true }), // Convert Sequelize model instance to plain object
      totalAssignedUsers: userCounts[index] // Attach the count
    }));

    return {
      docs: rolesWithUserCount,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  /**
   * @desc Get a single role by ID
   * @param {string} id - Role ID
   * @returns {Promise<Role>}
   */
  public async getRoleById(id: string) {
    const role = await this.roleOrError({ id });

    // Create a new loader instance per method call
    const roleUserCountLoader = createRoleUserCountLoader();

    // Get user count for the specific role ID
    const totalAssignedUsers = await roleUserCountLoader.load(role.id);

    // Return the role with totalAssignedUsers added
    return {
      ...role.get({ plain: true }),
      totalAssignedUsers
    };
  }

  public async deleteRole(id: string): Promise<void> {
    const role = await this.roleOrError({ id });
    await role.destroy();
  }

  /**
   * @desc Check if a role with the given name already exists
   * @param {string} name - Role name
   * @param {string} [id] - Role ID (to exclude when updating)
   * @throws {BaseError} - If the role already exists
   */
  private async errorIfRoleWithNameExists(name: string, id?: string): Promise<void> {
    const roleWithName = await Role.findOne({ where: { name, ...(id && { id: { [Op.ne]: id } }) } });
    if (roleWithName) throw new BaseError(ERRORS.ROLE_ALREADY_EXISTS);
  }

  public async roleOrError(filter: WhereOptions, joinedTables?: Includeable[]): Promise<Role> {
    const role = await Role.findOne({ where: filter, include: joinedTables || [] });
    if (!role) throw new BaseError(ERRORS.ROLE_NOT_FOUND);
    return role;
  }

  public async getPremissions(): Promise<any> {
    return getPermissionsGroupedByName();
  }
}

export default new RoleService();
