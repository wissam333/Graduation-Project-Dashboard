const handleResetStorage = (startActivity) => {
  if (startActivity) {
    // 3600 : in seconds, for 1 hours :
    if (Date.now() - startActivity > 3600 * 3 * 1000) {
      localStorage.removeItem("startActivity");
      localStorage.removeItem("userInfo");
      // Set Activate Date After remove it
      localStorage.setItem("startActivity", Date.now());
    }
  } else {
    // store date in localstorage
    // console.log(Date.now())
    localStorage.setItem("startActivity", Date.now());
  }
};

export default defineNuxtPlugin(async (nuxtApp) => {
  const startActivity = localStorage.getItem("startActivity");
  // Remove User Data (Token, info) after Some Time
  handleResetStorage(startActivity);

  // Get User Info
  const userInfo =
    localStorage.getItem("userInfo") != "undefined"
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
  // check if there error in storing auth data
  if (!userInfo) {
    localStorage.removeItem("userInfo");
    useAuth().value.isAuthenticated = false;
    useUserInfo().value = null;
  } else {
    // make global isAuthenticated state true
    useAuth().value.isAuthenticated = userInfo ? true : false;
    useUserInfo().value = userInfo;
  }
});
