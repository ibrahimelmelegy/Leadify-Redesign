import type { User } from '~/types';

export const user = ref<User | null>(null);

export function clearUser() {
  user.value = null;
}

export async function useUser(): Promise<User | null> {
  try {
    const response = await useApiFetch("auth/me");
    user.value = response?.user?.id ? response.user : null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    user.value = null;
  }
  return user.value;
}
