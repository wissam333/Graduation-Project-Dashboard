// ~/middleware/manager.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const userRole = useUserInfo().value.role;

  // Allow access if user is Manager (role '2') or Admin (role '0')
  if (userRole === "2" || userRole === "0") return;

  // Redirect unauthorized users
  return navigateTo("/forbidden"); // or throw createError(403)
});
