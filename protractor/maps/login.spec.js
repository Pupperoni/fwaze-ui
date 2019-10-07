const LoginPage = require("../pages/login.page");
const RegisterPage = require("../pages/register.page");

const DEFAULT_SLEEP = 1000;

describe("Login page", () => {
  let loginPage = LoginPage(),
    registerPage = RegisterPage();

  beforeAll(() => {
    // add a new user to test
    browser.get("http://localhost:4200/register");
    registerPage.name.sendKeys("root");
    registerPage.email.sendKeys("root@root");
    registerPage.password.sendKeys("root");
    registerPage.confirmPassword.sendKeys("root");
    registerPage.submit.click();
    browser.sleep(2 * DEFAULT_SLEEP);
  });

  beforeEach(() => {
    browser.get("http://localhost:4200/login");
  });

  describe("with missing details", () => {
    it("should not submit", () => {
      loginPage.name.sendKeys("root");

      loginPage.submit.click();
      browser.sleep(DEFAULT_SLEEP);

      // this should not redirect me to map
      expect(browser.getCurrentUrl()).toMatch("http://localhost:4200/login");
    });
  });

  describe("with incorrect details", () => {
    it("should not submit", () => {
      loginPage.name.sendKeys("root");
      loginPage.password.sendKeys("wrong");

      loginPage.submit.click();
      browser.sleep(DEFAULT_SLEEP);

      // this should not redirect me to map
      expect(browser.getCurrentUrl()).toMatch("http://localhost:4200/login");
    });
  });

  describe("with correct details", () => {
    it("should submit", () => {
      loginPage.name.sendKeys("root");
      loginPage.password.sendKeys("root");

      loginPage.submit.click();
      browser.sleep(DEFAULT_SLEEP);

      expect(browser.getCurrentUrl()).toMatch("http://localhost:4200");
      element(by.linkText("Logout")).click();
    });
  });
});
