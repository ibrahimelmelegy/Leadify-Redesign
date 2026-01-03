export const user = ref<any>({});

export async function useUser() {
  const response = await useApiFetch("auth/me");
  user.value = response?.user?.id ? response.user : {};
  return user.value;
}
