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
    
    // If token changed or no cached user, fetch user data
    if (token !== lastTokenCheck || !cachedUser) {
      const response = await useApiFetch("auth/me");
      if (response?.user?.id) {
        cachedUser = response.user;
        lastTokenCheck = token;
      } else {
        cachedUser = null;
        lastTokenCheck = null;
        if (publicRoutes.some((route) => to.path.startsWith(route))) {
          return;
        }
        return navigateTo("/login");
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
