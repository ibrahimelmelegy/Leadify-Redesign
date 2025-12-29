import DataLoader from 'dataloader';
import { Op } from 'sequelize';
import User from '../user/userModel';

export const createRoleUserCountLoader = () =>
  new DataLoader<string, number>(async (roleIds) => {
    const userCounts = await User.findAll({
      attributes: ['roleId', [User.sequelize!.fn('COUNT', User.sequelize!.col('id')), 'count']],
      where: { roleId: { [Op.in]: roleIds as string[] } },
      group: ['roleId'],
      raw: true
    });

    const userCountMap = new Map(
      userCounts.map((record: any) => [record.roleId, parseInt(record.count, 10)])
    );

    return roleIds.map((roleId) => userCountMap.get(roleId) || 0);
  });
