const RegisterPage = require("../pages/register.page");
const LoginPage = require("../pages/login.page");
const MapPage = require("../pages/map.page");
const NavbarPage = require("../pages/navbar.page");

const DEFAULT_SLEEP = 1000;
describe("Create report", () => {
  let mapPage = MapPage();
  beforeEach(() => {
    browser.get("http://localhost:4200");
  });

  describe("when not logged in", () => {
    it("should not create report", () => {
      browser
        .actions()
        .mouseMove(mapPage.map)
        .click()
        .mouseMove({ x: 0, y: -10 })
        .click()
        .perform();

      browser.sleep(DEFAULT_SLEEP);

      expect(mapPage.reportBtn.isPresent()).toBeFalsy();
    });
  });

  describe("when logged in", () => {
    let registerPage;
    let loginPage;
    let navbarPage;

    beforeAll(() => {
      //   create test user
      registerPage = RegisterPage();
      browser.get("http://localhost:4200/register");
      registerPage.name.sendKeys("create_report_test");
      registerPage.email.sendKeys("create@report.com");
      registerPage.password.sendKeys("create_report_test");
      registerPage.confirmPassword.sendKeys("create_report_test");
      registerPage.submit.click();

      browser.sleep(DEFAULT_SLEEP);

      //   // login using test user
      //   browser.get("http://localhost:4200/login");
      loginPage = LoginPage();
      loginPage.name.sendKeys("create_report_test");
      loginPage.password.sendKeys("create_report_test");
      loginPage.submit.click();

      browser.sleep(DEFAULT_SLEEP);
    });

    afterAll(() => {
      navbarPage = NavbarPage();
      navbarPage.logout.click();
      browser.sleep(DEFAULT_SLEEP);
    });

    it("should create report", () => {
      browser
        .actions()
        .mouseMove(mapPage.map)
        .click()
        .mouseMove({ x: 0, y: -10 })
        .click()
        .perform();

      browser.sleep(DEFAULT_SLEEP);

      browser
        .actions()
        .mouseMove(mapPage.reportBtn)
        .click()
        .perform();

      browser.sleep(DEFAULT_SLEEP);

      browser
        .actions()
        .mouseMove(mapPage.reportSubmit)
        .click()
        .perform();

      expect(mapPage.reportObj).toBeTruthy();

      browser.sleep(2 * DEFAULT_SLEEP);
    });
  });
});
