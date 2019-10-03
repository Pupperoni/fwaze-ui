module.exports = function() {
  return {
    name: element(by.id("name")),
    password: element(by.id("password")),
    submit: element(by.id("login-btn"))
  };
};
