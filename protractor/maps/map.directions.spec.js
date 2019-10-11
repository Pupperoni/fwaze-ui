const RoutePage = require("../pages/route.page");
const DEFAULT_SLEEP = 1000;
describe("Map directions", () => {
  let routePage = RoutePage();
  beforeEach(() => {
    browser.get("http://localhost:4200");
  });

  describe("route input form", () => {
    it("should show direction info", () => {
      routePage.sourceInput.sendKeys("UP Diliman");
      browser.sleep(DEFAULT_SLEEP);
      routePage.sourceResult.click();

      browser.sleep(DEFAULT_SLEEP);

      routePage.destInput.sendKeys("Ateneo de Manila");
      browser.sleep(DEFAULT_SLEEP);
      routePage.destResult.click();

      browser.sleep(3 * DEFAULT_SLEEP);

      expect(routePage.directions).toBeTruthy();
    });
  });
});
