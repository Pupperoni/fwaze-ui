const MapPage = require("../pages/map.page");
const DEFAULT_SLEEP = 1000;
fdescribe("Map directions", () => {
  let mapPage = MapPage();
  beforeEach(() => {
    browser.get("http://localhost:4200");
  });

  describe("route input form", () => {
    it("should show direction info", () => {
      mapPage.sourceInput.sendKeys("2 Mango Road Potrero Malabon");
      browser.sleep(DEFAULT_SLEEP);
      mapPage.sourceResult.click();

      browser.sleep(DEFAULT_SLEEP);

      mapPage.destInput.sendKeys("Saperium Incorporated");
      browser.sleep(DEFAULT_SLEEP);
      mapPage.destResult.click();

      browser.sleep(3 * DEFAULT_SLEEP);

      expect(mapPage.directions).toBeTruthy();
    });
  });
});
