export default defineNuxtRouteMiddleware((to, from) => {
  const userRole = useUserInfo().value.role;

  // Skip middleware on server side
  if (process.server) return;

  // Allow access if user is Admin (role '0')
  if (userRole === "0") return;

  // Throw 403 error for non-Admins
  throw createError({
    statusCode: 403,
    statusMessage: "Forbidden",
    message: "You do not have permission to access this page",
  });
});
