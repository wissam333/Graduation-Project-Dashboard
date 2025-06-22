export default defineNuxtRouteMiddleware((to, from) => {
  const userRole = useUserInfo().value.role;

  // Skip middleware on server side
  if (process.server) return;

  if (userRole == "3") return;

  // Throw 403 Forbidden error for unauthorized users
  throw createError({
    statusCode: 403,
    statusMessage: "Forbidden",
    message: "You do not have permission to access this resource",
  });
});
