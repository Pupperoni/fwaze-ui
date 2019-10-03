exports.config = {
  framework: "jasmine",
  seleniumAddress: "http://localhost:4444/wd/hub",
  specs: ["./**/*.spec.[tj]s"],

  suites: {
    full: "./**/*.spec.[tj]s"
  },

  onPrepare: () => {
    let globals = require("protractor");
    let browser = globals.browser;
    browser.ignoreSynchronization = true;
  }
};
