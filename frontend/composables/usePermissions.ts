import { user, useUser, clearUser } from "@/composables/useUser";

const permissions = ref<string[]>([]);
const isLoaded = ref(false);

export function clearPermissions() {
  permissions.value = [];
  isLoaded.value = false;
}

export async function usePermissions(isUpdated = false) {
  if (!isLoaded.value || isUpdated) {
    if (!user.value?.id) {
      await useUser();
    }
    if (user.value?.roleId) {
      try {
        const response = await useApiFetch(`role/${user.value.roleId}`);
        if (response?.body?.permissions) {
          permissions.value = response.body.permissions;
          isLoaded.value = true;
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        permissions.value = [];
      }
    }
  }

  const hasPermission = (permission: string): boolean => {
    return permissions.value.includes('all') || permissions.value.includes(permission);
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((perm) => hasPermission(perm));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    clearPermissions,
  };
}
