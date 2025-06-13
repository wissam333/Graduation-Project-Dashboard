export default defineNuxtRouteMiddleware((to, from) => {
  const userRole = useUserInfo().value.role;

  // Allow access if user is Admin (role '0')
  if (userRole === "0") return;

  // Redirect non-Admins to a forbidden page (or login)
  return navigateTo("/forbidden"); // or throw createError(403)
});
