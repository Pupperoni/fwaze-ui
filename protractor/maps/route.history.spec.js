const LoginPage = require("../pages/login.page");
const RegisterPage = require("../pages/register.page");
const RoutePage = require("../pages/route.page");
const HistoryPage = require("../pages/history.page");

const DEFAULT_SLEEP = 1000;

describe("Route history page", () => {
  let loginPage = LoginPage(),
    registerPage = RegisterPage(),
    routePage = RoutePage(),
    historyPage = HistoryPage();

  beforeEach(() => {
    // add a new user to test
    browser.get("http://localhost:4200/register");
    registerPage.name.sendKeys("routeHistoryTest");
    registerPage.email.sendKeys("routeHistoryTest@routeHistoryTest");
    registerPage.password.sendKeys("routeHistoryTest");
    registerPage.confirmPassword.sendKeys("routeHistoryTest");
    registerPage.submit.click();

    browser.sleep(DEFAULT_SLEEP);

    loginPage.name.sendKeys("routeHistoryTest");
    loginPage.password.sendKeys("routeHistoryTest");
    loginPage.submit.click();

    browser.sleep(2 * DEFAULT_SLEEP);

    routePage.sourceInput.sendKeys("UP Diliman");
    browser.sleep(DEFAULT_SLEEP);
    routePage.sourceResult.click();

    browser.sleep(DEFAULT_SLEEP);

    routePage.destInput.sendKeys("Ateneo de Manila");
    browser.sleep(DEFAULT_SLEEP);
    routePage.destResult.click();

    browser.sleep(3 * DEFAULT_SLEEP);

    browser.get("http://localhost:4200/history");

    browser.sleep(DEFAULT_SLEEP);
  });

  describe("delete route history button", () => {
    it("should delete", () => {
      historyPage.deleteBtn.click();

      browser.sleep(3 * DEFAULT_SLEEP);

      expect(historyPage.emptyRouteInfo.getText()).toEqual("No routes to show");
    });
  });
});
