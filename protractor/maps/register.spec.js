const RegisterPage = require("../pages/register.page");

const DEFAULT_SLEEP = 1000;

describe("Register page", () => {
  let registerPage = RegisterPage();
  beforeEach(() => {
    browser.get("http://localhost:4200/register");
  });

  describe("with missing details", () => {
    it("should not submit", () => {
      registerPage.name.sendKeys("test");

      registerPage.submit.click();
      browser.sleep(DEFAULT_SLEEP);

      // this should not redirect me to login
      expect(browser.getCurrentUrl()).toMatch("http://localhost:4200/register");
    });
  });

  describe("with invalid details", () => {
    it("should not submit", () => {
      registerPage.name.sendKeys("test");
      registerPage.email.sendKeys("test//notvalid");
      registerPage.password.sendKeys("test");
      registerPage.password.sendKeys("test");

      registerPage.submit.click();
      browser.sleep(DEFAULT_SLEEP);

      // this should not redirect me to login
      expect(browser.getCurrentUrl()).toMatch("http://localhost:4200/register");
    });
  });

  describe("with nonmatching passwords", () => {
    it("should not submit", () => {
      registerPage.name.sendKeys("test");
      registerPage.email.sendKeys("test@test");
      registerPage.password.sendKeys("test");
      registerPage.confirmPassword.sendKeys("wrong");

      registerPage.submit.click();
      browser.sleep(DEFAULT_SLEEP);

      // this should not redirect me to login
      expect(browser.getCurrentUrl()).toMatch("http://localhost:4200/register");
    });
  });

  describe("with correct details", () => {
    it("should submit", () => {
      registerPage.name.sendKeys("test");
      registerPage.email.sendKeys("test@test");
      registerPage.password.sendKeys("test");
      registerPage.confirmPassword.sendKeys("test");

      registerPage.submit.click();
      browser.sleep(DEFAULT_SLEEP);

      expect(browser.getCurrentUrl()).toMatch("http://localhost:4200/login");
    });
  });
});
