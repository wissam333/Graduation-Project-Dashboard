export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const auth = useAuth();
    if (auth.value.isAuthenticated) {
      return navigateTo("/main", { redirectCode: 401 });
    }
  }
});
