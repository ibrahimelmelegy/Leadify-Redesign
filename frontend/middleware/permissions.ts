export default defineNuxtRouteMiddleware(async (to) => {
  const { hasPermission } = await usePermissions();

  const requiredPermission = to.meta?.permission as string | undefined;

  if (requiredPermission && !hasPermission(requiredPermission)) {
    throw createError({
      statusCode: 404,
      message: "You don't have permission to access this page",
    });
  }
});
