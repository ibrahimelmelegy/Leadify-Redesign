import { user, useUser } from "@/composables/useUser";

const permissions = ref<string[]>([]);
const isLoaded = ref(false);

export async function usePermissions(isUpdated = false) {
  if (!isLoaded.value || isUpdated) {
    if (!user.value?.id) {
      await useUser(); // populates `user`
    }
    if (user.value?.roleId) {
      const response = await useApiFetch(`role/${user.value.roleId}`);

      if (response?.body?.permissions) {
        permissions.value = response.body.permissions;
        isLoaded.value = true;
      }
    }
  }

  const hasPermission = (permission: string): boolean => {
    return permissions.value.includes(permission);
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((perm) => hasPermission(perm));
  };

  return {
    hasPermission,
    hasAnyPermission,
  };
}
