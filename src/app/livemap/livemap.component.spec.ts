import { LivemapComponent } from "./livemap.component";
import { of } from "rxjs";

xdescribe("Livemap component", () => {
  let component: LivemapComponent;
  let mockCookieService;
  let mockCurrentMarkerService;
  let mockReportService;
  let mockUserService;
  let mockAdvertisementService;
  let mockEventService;

  beforeEach(() => {
    mockCurrentMarkerService = jasmine.createSpyObj(
      "mockCurrentMarkerService",
      ["getMarker", "setMarker"]
    );

    mockReportService = jasmine.createSpyObj("mockReportService", [
      "getAllReportsByTypeBounds"
    ]);

    mockAdvertisementService = jasmine.createSpyObj(
      "mockAdvertisementService",
      ["getAllAdsByBounds"]
    );

    mockReportService.getAllReportsByTypeBounds.and.callFake(
      (type, tright, bleft) => {
        return of({ reports: [] });
      }
    );

    component = new LivemapComponent(
      mockCookieService,
      mockCurrentMarkerService,
      mockReportService,
      mockUserService,
      mockAdvertisementService,
      mockEventService
    );
  });

  describe("is active", () => {
    it("should return correct value", () => {
      expect(component.isActive("DRIVING")).toBeTruthy();
      component.transitOptions = "WALKING";
      expect(component.isActive("WALKING")).toBeTruthy();
      expect(component.isActive("DRIVING")).toBeFalsy();
      expect(component.isActive("something")).toBeFalsy();
    });
  });

  describe("on map click", () => {});

  describe("on report submit", () => {
    it("should update the current marker", () => {
      mockCurrentMarkerService.getMarker.and.callFake(() => {
        return undefined;
      });
      let event = {};
      component.onReportSubmit(event);
    });
  });

  describe("on ad submit", () => {
    it("should update the current marker", () => {
      mockCurrentMarkerService.getMarker.and.callFake(() => {
        return undefined;
      });
      let event = {};
      component.onAdSubmit(event);
    });
  });

  describe("on filter submit", () => {
    it("removes all reports", () => {
      let event = {
        type: [
          { name: "Traffic Jam", apiName: "traffic_jam", active: true },
          {
            name: "Heavy Traffic Jam",
            apiName: "heavy_traffic_jam",
            active: true
          },
          { name: "Police", apiName: "police", active: true },
          { name: "Road Closed", apiName: "closed_road", active: true },
          { name: "Car Stopped", apiName: "car_stopped", active: true },
          { name: "Construction", apiName: "construction", active: true },
          { name: "Minor Accident", apiName: "minor_accident", active: true },
          { name: "Major Accident", apiName: "major_accident", active: true },
          { name: "Others", apiName: "others", active: true }
        ],
        group: [false, true]
      };
      component.onFilterSubmit(event);
      expect(component.reportMarkers).toEqual([]);
    });

    it("removes all ads", () => {
      let event = {
        type: [
          { name: "Traffic Jam", apiName: "traffic_jam", active: true },
          {
            name: "Heavy Traffic Jam",
            apiName: "heavy_traffic_jam",
            active: true
          },
          { name: "Police", apiName: "police", active: true },
          { name: "Road Closed", apiName: "closed_road", active: true },
          { name: "Car Stopped", apiName: "car_stopped", active: true },
          { name: "Construction", apiName: "construction", active: true },
          { name: "Minor Accident", apiName: "minor_accident", active: true },
          { name: "Major Accident", apiName: "major_accident", active: true },
          { name: "Others", apiName: "others", active: true }
        ],
        group: [true, false]
      };
      component.onFilterSubmit(event);
      expect(component.adMarkers).toEqual([]);
    });

    it("filters by report type", () => {
      let event = {
        type: [
          { name: "Traffic Jam", apiName: "traffic_jam", active: true },
          {
            name: "Heavy Traffic Jam",
            apiName: "heavy_traffic_jam",
            active: false
          },
          { name: "Police", apiName: "police", active: true },
          { name: "Road Closed", apiName: "closed_road", active: false },
          { name: "Car Stopped", apiName: "car_stopped", active: false },
          { name: "Construction", apiName: "construction", active: false },
          { name: "Minor Accident", apiName: "minor_accident", active: false },
          { name: "Major Accident", apiName: "major_accident", active: false },
          { name: "Others", apiName: "others", active: false }
        ],
        group: [true, false]
      };
      component.tright = "10,20";
      component.bleft = "20,10";
      component.onFilterSubmit(event);
      expect(mockReportService.getAllReportsByTypeBounds).toHaveBeenCalledTimes(
        2
      );
      expect(
        mockReportService.getAllReportsByTypeBounds.calls.argsFor[0]
      ).toEqual(["traffic_jam", "10,20", "20,10"]);
      expect(
        mockReportService.getAllReportsByTypeBounds.calls.argsFor[0]
      ).toEqual(["police", "10,20", "20,10"]);
    });
  });

  describe("change travel", () => {});

  describe("swap", () => {});

  describe("add home", () => {});

  describe("add work", () => {});

  describe("set location now", () => {});

  describe("on route used", () => {});

  describe("source address change", () => {});

  describe("destination address change", () => {});

  describe("delete markers", () => {});

  describe("map zoom change", () => {});

  describe("add report to markers", () => {});
});
