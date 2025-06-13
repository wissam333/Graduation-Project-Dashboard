export default defineNuxtRouteMiddleware((to, from) => {
  const userRole = useUserInfo().value.role;

  // Allow access if user is Manager (role '2') or Admin (role '0')
  if (userRole === "2") return;

  // Throw 403 Forbidden error for unauthorized users
  throw createError({
    statusCode: 403,
    statusMessage: "Forbidden",
    message: "You do not have permission to access this resource",
  });
});
