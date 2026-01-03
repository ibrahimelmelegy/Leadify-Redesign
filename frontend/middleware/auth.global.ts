export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    // Define public routes that do not require authentication
    const publicRoutes = ["/login", "/forget-password", "/reset-password", "/reset-complete"];
    // Fetch authentication status
    const response = await useApiFetch("auth/me");
    // If user is not authenticated
    if (!response?.user?.id) {
      // Allow access to public routes
      if (publicRoutes.some((route) => to.path.startsWith(route))) {
        return; // Allow navigation to public route
      }
      // Redirect to login if the route is not public
      return navigateTo("/login");
    }
    // If user is authenticated
    if (publicRoutes.some((route) => to.path.startsWith(route))) {
      // Redirect authenticated users away from public routes (e.g., to homepage)
      return navigateTo("/");
    }
    // Allow navigation to the target route
  } catch (error) {
    console.error("Middleware error:", error); // Log unexpected errors
    return navigateTo("/login"); // Redirect to login in case of an error
  }
});
