module.exports = function() {
  return {
    name: element(by.id("name")),
    email: element(by.id("email")),
    password: element(by.id("password")),
    confirmPassword: element(by.id("confirm-password")),
    submit: element(by.id("register-btn"))
  };
};
