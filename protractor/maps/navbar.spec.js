const NavbarPage = require("../pages/navbar.page"),
  LoginPage = require("../pages/login.page");
const DEFAULT_SLEEP = 1000;

describe("Navbar page", () => {
  let navbarPage;

  beforeEach(() => {
    browser.get("http://localhost:4200");
    navbarPage = NavbarPage();
  });

  describe("when logged out", () => {
    it("should have login button", () => {
      expect(navbarPage.login).toBeTruthy();
    });
    it("should have register button", () => {
      expect(navbarPage.register).toBeTruthy();
    });
  });

  describe("when logged in", () => {
    let loginPage;

    beforeEach(() => {
      browser.get("http://localhost:4200/login");
      loginPage = LoginPage();
      loginPage.name.sendKeys("root");
      loginPage.password.sendKeys("root");

      loginPage.submit.click();
      browser.sleep(DEFAULT_SLEEP);
    });

    afterEach(() => {
      navbarPage.logout.click();
      browser.sleep(DEFAULT_SLEEP);
    });

    it("should have logout button", () => {
      expect(navbarPage.logout).toBeTruthy();
    });

    it("should have user detail button", () => {
      expect(navbarPage.user).toBeTruthy();
      expect(navbarPage.user.getText()).toEqual("root");
    });
  });
});
