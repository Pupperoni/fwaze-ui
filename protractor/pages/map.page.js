module.exports = function() {
  return {
    map: element(by.tagName("agm-map")),
    reportBtn: element(
      by.xpath(
        "/html/body/app-root/div/app-livemap/div/div/agm-map/div[1]/div/div/div[1]/div[3]/div/div[4]/div/div/div/div/div/div/div[2]/button"
      )
    ),
    reportSubmit: element(
      by.xpath(
        "/html/body/app-root/div/app-livemap/div/app-report-modal/div/div/div/div/div[3]/button[2]"
      )
    ),
    reportObj: element(
      by.xpath(
        '//*[@id="wrapper"]/agm-map/div[1]/div/div/div[1]/div[3]/div/div[4]/div/div/div/div/div/div/div/div[1]/div[2]'
      )
    )
  };
};
