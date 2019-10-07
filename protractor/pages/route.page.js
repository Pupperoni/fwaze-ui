module.exports = function() {
  return {
    sourceInput: element(by.id("src")),
    destInput: element(by.id("dest")),
    directions: element(by.className("direction-data-container")),
    sourceResult: element(by.xpath("/html/body/div[1]/div[1]")),
    destResult: element(by.xpath("/html/body/div[2]/div[1]"))
  };
};
