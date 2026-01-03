import { defineStore } from 'pinia';
import { ElNotification } from 'element-plus';
import { PageInfoFragment, UsersTableFragment, UserInfoFragment } from '#gql';
import { useMain } from '~/stores/common';

export const useUsers = defineStore('Users', {
  state: () => ({
    loadingusers: false,
    loadinguser: false,
    loadingmedical: false,
  }),
  actions: {
    async getUsers(filter, search, sort, currentPage, limit) {
      const mainData = useMain();
      this.loadingusers = true;

      const { data } = await useAsyncGql('usersBoard', {
        // ...(sortoption && { sort: sortoption}),
        paginate: { page: currentPage, limit: limit },
        filter: {
          ...(search && { searchKey: search }),

          ...(filter.isBlocked && {
            isBlocked: filter.isBlocked === 'Banned' ? true : false,
          }),
          ...(filter.isBlocked && {
            isDeleted: filter.isBlocked === 'Deleted' ? true : false,
          }),

          ...(filter?.gender && { gender: filter.gender }),
          ...(filter?.userType && {
            preferNickName: filter.userType === 'Alias name' ? true : false,
          }),
        },
        ...(sort && { sort: sort }),
      });

      getErrorCode(data.value.usersBoard.code, data.value.usersBoard.message);

      if (data.value.usersBoard.success) {
        this.loadingusers = false;
      }
      const users = data.value.usersBoard?.data?.items as UsersTableFragment[];
      const pageInfo = data.value.usersBoard?.data?.pageInfo as PageInfoFragment;
      return { users, pageInfo };
    },
    async getUser(id: string) {
      this.loadinguser = true;
      const { data } = await useAsyncGql('userBoard', { id: id });

      getErrorCode(data.value.userBoard.code, data.value.userBoard.message);

      this.loadinguser = false;

      const user = data.value.userBoard.data as UserInfoFragment;

      return user;
    },
    async getAnalytics(id: string) {
      this.loadinguser = true;
      const { data } = await useAsyncGql('userProfileStatistics', { id: id });

      getErrorCode(data.value.userProfileStatistics.code, data.value.userProfileStatistics.message);

      this.loadinguser = false;

      const user = data.value.userProfileStatistics.data;

      return user;
    },
    async getMedicalReport(id: string, currentPage, limit) {
      this.loadingmedical = true;
      const { data } = await useAsyncGql('medicalReportsByUserId', {
        id: id,
        paginate: { limit: limit, page: currentPage },
      });

      getErrorCode(data.value.medicalReportsByUserId.code, data.value.medicalReportsByUserId.message);

      this.loadingmedical = false;

      const medicalReport = data.value.medicalReportsByUserId.data.items;
      const pageInfo = data.value.medicalReportsByUserId.data?.pageInfo;
      return { medicalReport, pageInfo };
    },
    async BanUser(id, status) {
      this.loadinguser = true;
      const { data } = await useAsyncGql('blockUserBoard', {
        id,
      });

      this.loadinguser = false;
      if (data.value.blockUserBoard.success) {
        ElNotification({
          type: 'success',
          title: status ? 'Unbanned' : 'Banned',
          message: `Client has been ${status ? 'Unbanned' : 'Banned'} successfully`,
        });
      } else {
        ElNotification({
          title: 'Error',
          type: 'error',
          message: formatTextWithUnderscore(data.value.blockUserBoard.message),
        });
      }
      return {
        success: data.value.blockUserBoard.success,
        message: data.value.blockUserBoard.message,
      };
    },
    async deleteUser(id) {
      this.loadinguser = true;
      const { data } = await useAsyncGql('deleteUserBoard', {
        id,
      });

      this.loadinguser = false;
      if (data.value.deleteUserBoard.success) {
        ElNotification({
          type: 'success',
          title: 'Deleted',
          message: 'Client has been deleted successfully',
        });
      } else {
        ElNotification({
          title: 'Error',
          type: 'error',
          message: formatTextWithUnderscore(data.value.deleteUserBoard.message),
        });
      }
      return {
        success: data.value.deleteUserBoard.success,
        message: data.value.deleteUserBoard.message,
      };
    },
    async AddUser(input: any) {
      this.loadinguser = true;
      const { data } = await useAsyncGql('createUserBoard', {
        input: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          birthDate: new Date(input.birthDate).getTime(),
          nationalityId: input.nationalityId,
          ...(input.identityInfo && {
            identityInfo: {
              name: input.identityName,
              nationalityType: input.nationalityIdType === 'IQAMA' ? 'RESIDENCE' : 'NATIONALITY',
              number: input.identityInfo,
            },
          }),
          gender: input.gender.toUpperCase(),
          phone: input.phone.replaceAll(' ', ''),
        },
      });
      this.loadinguser = false;
      if (data.value.createUserBoard.success) {
        ElNotification({
          title: 'Success',
          type: 'success',
          message: 'Client has been Added successfully',
        });
      } else {
        ElNotification({
          title: 'Error',
          type: 'error',
          message: formatTextWithUnderscore(data.value.createUserBoard.message),
        });
      }
      return data.value.createUserBoard.success;
    },
    async updateUser(input: any) {
      this.loadinguser = true;
      const { data } = await useAsyncGql('updateUserBoard', {
        input: {
          userId: input.id,
          firstName: input.firstName,
          ...(input.lastName && { lastName: input.lastName }),
          ...(input.email && { email: input.email }),
          ...(input.birthDate && {
            birthDate: new Date(input.birthDate).getTime(),
          }),

          ...(input.nationalityId && { nationalityId: input.nationalityId }),
          ...(input.identityInfo && {
            identityInfo: {
              name: input.identityName,
              nationalityType: input.nationalityIdType === 'IQAMA' ? 'RESIDENCE' : 'NATIONALITY',
              number: input.identityInfo,
            },
          }),
          ...(input.gender && { gender: input.gender.toUpperCase() }),
          ...(input.phone && { phone: input.phone.replaceAll(' ', '') }),
        },
      });
      this.loadinguser = false;
      if (data.value.updateUserBoard.success) {
        ElNotification({
          title: 'Success',
          type: 'success',
          message: 'Client has been Updated successfully',
        });
      } else {
        ElNotification({
          title: 'Error',
          type: 'error',
          message: formatTextWithUnderscore(data.value.updateUserBoard.message),
        });
      }
      return data.value.updateUserBoard.success;
    },
  },
});
