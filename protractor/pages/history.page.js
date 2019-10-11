module.exports = function() {
  return {
    deleteBtn: element(by.className("btn-danger")),
    routeHistoryList: element(by.id("route-history-list")),
    emptyRouteInfo: element(by.className("route-info-empty"))
  };
};
