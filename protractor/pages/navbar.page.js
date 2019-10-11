module.exports = function() {
  let loginBtn = element(by.linkText("Login"));
  let registerBtn = element(by.linkText("Register"));
  let logoutBtn = element(by.linkText("Logout"));
  let userDetailBtn = element(by.id("user-detail"));
  let viewAppsBtn = element(by.linkText("View Applications"));
  let routeHistoryButton = element(by.linkText("History"));
  let homeBtn = element(by.linkText("FWaze"));
  return {
    login: loginBtn,
    register: registerBtn,
    user: userDetailBtn,
    logout: logoutBtn,
    applications: viewAppsBtn,
    history: routeHistoryButton,
    home: homeBtn
  };
};
