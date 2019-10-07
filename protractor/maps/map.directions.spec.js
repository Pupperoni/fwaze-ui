const MapPage = require("../pages/route.page");
const DEFAULT_SLEEP = 1000;
describe("Map directions", () => {
  let mapPage = MapPage();
  beforeEach(() => {
    browser.get("http://localhost:4200");
  });

  describe("route input form", () => {
    it("should show direction info", () => {
      mapPage.sourceInput.sendKeys("UP Diliman");
      browser.sleep(DEFAULT_SLEEP);
      mapPage.sourceResult.click();

      browser.sleep(DEFAULT_SLEEP);

      mapPage.destInput.sendKeys("Ateneo de Manila");
      browser.sleep(DEFAULT_SLEEP);
      mapPage.destResult.click();

      browser.sleep(3 * DEFAULT_SLEEP);

      expect(mapPage.directions).toBeTruthy();
    });
  });
});
