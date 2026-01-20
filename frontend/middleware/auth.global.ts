// Cache user data to avoid repeated API calls
let cachedUser: any = null;
let lastTokenCheck: string | null = null;

export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const publicRoutes = ["/login", "/forget-password", "/reset-password", "/reset-complete"];

    // Check for token
    const accessTokenCookie = useCookie('access_token');
    let token = accessTokenCookie.value;
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('access_token');
    }

    // If no token, handle public/private routes
    if (!token) {
      cachedUser = null;
      lastTokenCheck = null;
      if (publicRoutes.some((route) => to.path.startsWith(route))) {
        return;
      }
      return navigateTo("/login");
    }

    // OPTIMIZATION: Optimistic Auth
    // If token exists, assume authenticated to allow UI to render immediately.
    // We verify the token in the background (or let specific API calls fail with 401).
    if (token && !cachedUser && !publicRoutes.some((route) => to.path.startsWith(route))) {
      // We don't block navigation here. 
      // The layout/page will fetch data. If 401, the API interceptor (if any) or component should handle it.
      // However, to populate user state, we can fire this in background:
      if (process.client) {
        useApiFetch("auth/me").then((response: any) => {
          if (response?.user?.id) {
            cachedUser = response.user;
            lastTokenCheck = token;
          }
        }).catch(() => {
          // Token invalid, user will be redirected on next protected action
          cachedUser = null;
        });
      }
    }

    // User is authenticated, redirect away from public routes
    if (publicRoutes.some((route) => to.path.startsWith(route))) {
      return navigateTo("/");
    }
  } catch (error) {
    console.error("Middleware error:", error);
    cachedUser = null;
    lastTokenCheck = null;
    return navigateTo("/login");
  }
});
