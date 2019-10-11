import { RouteHistoryComponent } from "./route-history.component";
import { of } from "rxjs";

describe("Route history component", () => {
  let component: RouteHistoryComponent;
  let mockRouteHistoryService;
  let mockCookieService;

  beforeEach(() => {
    mockCookieService = jasmine.createSpyObj("mockCookieService", [
      "get",
      "check"
    ]);

    mockCookieService.check.and.returnValue(true);
    mockCookieService.get.and.returnValue(
      JSON.stringify({
        id: "someUser",
        name: "someName",
        email: "some@email.com",
        role: 0,
        home: null,
        work: null
      })
    );

    mockRouteHistoryService = jasmine.createSpyObj("mockRouteHistoryService", [
      "getRouteHistoryByUserId",
      "deleteRouteHistory"
    ]);

    mockRouteHistoryService.getRouteHistoryByUserId.and.callFake(data => {
      return of({
        history: [
          {
            id: "route1",
            userId: data.userId,
            sourceAddress: "source",
            sourcePosition: { x: 5, y: 10 },
            destinationAddress: "destination",
            destinationPosition: { x: 10, y: 20 },
            timestamp: "2019-10-10T13:20:00.000Z"
          }
        ]
      });
    });

    mockRouteHistoryService.deleteRouteHistory.and.callFake(id => {
      return of(true);
    });
    component = new RouteHistoryComponent(
      mockRouteHistoryService,
      mockCookieService
    );
  });

  describe("get route history", () => {
    it("should initialize route history", () => {
      component.ngOnInit();
      expect(component.routeHistory).toEqual([
        {
          id: "route1",
          userId: "someUser",
          sourceAddress: "source",
          sourcePosition: { x: 5, y: 10 },
          destinationAddress: "destination",
          destinationPosition: { x: 10, y: 20 },
          timestamp: "2019-10-10T13:20:00.000Z"
        }
      ]);
    });
  });

  describe("delete route history", () => {
    it("should trigger removed", () => {
      component.ngOnInit();
      component.deleteRouteHistory("route1");
      expect(component.routeHistory[0]).toEqual({
        id: "route1",
        userId: "someUser",
        sourceAddress: "source",
        sourcePosition: { x: 5, y: 10 },
        destinationAddress: "destination",
        destinationPosition: { x: 10, y: 20 },
        timestamp: "2019-10-10T13:20:00.000Z",
        removed: true
      });
    });

    it("should delete route", () => {
      component.ngOnInit();
      component.transitionEnd(null, 0);
      expect(component.routeHistory).toEqual([]);
    });
  });
});
