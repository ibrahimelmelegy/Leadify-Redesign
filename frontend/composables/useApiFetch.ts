export type apiEndpoints =
  | 'auth/forgot-password'
  | 'users'
  | 'auth/reset-password'
  | 'auth/check-reset-token'
  | 'auth/logout'
  | 'auth/login'
  | 'auth/me'
  | 'lead'
  | 'users'
  // | `users/${string}`
  | 'role'
  | `lead/${string}`
  | `lead?${string}`
  | `${string}?${string}`
  | `opportunity`
  | `opportunity/${string}`
  | `opportunity?${string}`
  | `${string}`
  | 'proposal';

export const useApiFetch = async (
  url: apiEndpoints,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data = {},
  silence: boolean = false,
  isFd: boolean = false
): Promise<{
  [x: string]: any;
  data?: any;
  status?: boolean;
  message?: string;
  error?: any;
}> => {
  const config = useRuntimeConfig();
  const accessTokenCookie = useCookie('access_token');
  let token = accessTokenCookie.value;
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
  }
  const defaultOptions = {
    method,
    body: method === 'GET' ? null : data,
    headers: {
      ...(!isFd && { 'Content-Type': 'application/json' }),
      ...(!isFd && { Accept: 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  try {
    return await $fetch(config.public.API_BASE_URL + url, defaultOptions);
  } catch (error: any) {
    let message = error?.response?._data?.message || 'Something went wrong';
    error;
    if (!silence) {
      console.error(message);
    }
    return {
      data: null,
      status: false,
      message,
      error,
    };
  }
};
