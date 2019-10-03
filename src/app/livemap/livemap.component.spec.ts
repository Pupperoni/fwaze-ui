import { LivemapComponent } from "./livemap.component";
import { of } from "rxjs";

describe("Livemap component", () => {
  let component: LivemapComponent;
  let mockCookieService;
  let mockCurrentMarkerService;
  let mockReportService;
  let mockUserService;
  let mockAdvertisementService;
  let mockEventService;
  let mockGMapsService;

  beforeEach(() => {
    mockGMapsService = jasmine.createSpyObj("mockGMapsService", [
      "getGeocoder",
      "getLatLng"
    ]);

    mockGMapsService.getGeocoder.and.callFake(() => {
      return {
        geocode: function(request, callback) {
          let res = [{ formatted_address: "some body" }];
          callback(res);
        }
      };
    });

    mockCurrentMarkerService = jasmine.createSpyObj(
      "mockCurrentMarkerService",
      ["getMarker", "setMarker", "setMarkerLocation", "getMarkerLocation"]
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
    mockAdvertisementService.getAllAdsByBounds.and.callFake((tright, bleft) => {
      return of({ ads: [] });
    });

    component = new LivemapComponent(
      mockCookieService,
      mockCurrentMarkerService,
      mockReportService,
      mockUserService,
      mockAdvertisementService,
      mockEventService,
      mockGMapsService
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

  describe("on map click", () => {
    it("should call set marker and get marker", () => {
      let saved;
      mockCurrentMarkerService.getMarkerLocation.and.callFake(() => {
        return saved;
      });
      mockCurrentMarkerService.setMarkerLocation.and.callFake(data => {
        saved = data;
      });
      mockCurrentMarkerService.getMarker.and.returnValue({
        lat: 10,
        lng: 20
      });

      let event: any = {
        coords: {
          lat: 10,
          lng: 20
        }
      };

      component.onMapClick(event);

      expect(mockCurrentMarkerService.setMarker).toHaveBeenCalledWith({
        lat: 10,
        lng: 20
      });
      expect(mockCurrentMarkerService.setMarker).toHaveBeenCalledBefore(
        mockCurrentMarkerService.getMarker
      );
      expect(component.currentMarker).toEqual({
        lat: 10,
        lng: 20
      });
      expect(mockCurrentMarkerService.setMarkerLocation).toHaveBeenCalledWith(
        "some body"
      );
      expect(component.location).toEqual("some body");
    });
  });

  describe("on report submit", () => {
    it("should update the current marker", () => {
      let saved;
      mockCurrentMarkerService.getMarker.and.callFake(() => {
        return saved;
      });
      mockCurrentMarkerService.setMarker.and.callFake(data => {
        saved = data;
      });
      let event = {};
      component.onReportSubmit(event);
      expect(component.currentMarker).toBeUndefined();
    });
  });

  describe("on ad submit", () => {
    it("should update the current marker", () => {
      let saved;
      mockCurrentMarkerService.getMarker.and.callFake(() => {
        return saved;
      });
      mockCurrentMarkerService.setMarker.and.callFake(data => {
        saved = data;
      });
      let event = {};
      component.onAdSubmit(event);
      expect(component.currentMarker).toBeUndefined();
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
        mockReportService.getAllReportsByTypeBounds.calls.argsFor(0)
      ).toEqual(["traffic_jam", "10,20", "20,10"]);
      expect(
        mockReportService.getAllReportsByTypeBounds.calls.argsFor(1)
      ).toEqual(["police", "10,20", "20,10"]);
    });
  });

  describe("change travel", () => {
    it("should change transit options value", () => {
      expect(component.transitOptions).toEqual("DRIVING");

      let newTravel = "WALKING";
      component.changeTravel(newTravel);

      expect(component.transitOptions).toEqual("WALKING");
    });
  });

  describe("swap", () => {
    it("should assign source", () => {
      let source = { lat: 10, lng: 20 };
      let destination = { lat: null, lng: null };

      /**
       * event came from route options component and
       * is already swapped when it reaches the
       * livemap component
       */
      let event = {
        source: source,
        sourceString: "source",
        destination: destination,
        destString: null
      };

      component.swap(event);

      expect(component.source.lat).toEqual(10);
      expect(component.source.lng).toEqual(20);
      expect(component.sourceString).toEqual("source");
      expect(component.destination.lat).toBeUndefined();
      expect(component.destination.lng).toBeUndefined();
      expect(component.destString).toEqual("");
    });

    it("should assign destination", () => {
      let destination = { lat: 10, lng: 20 };
      let source = { lat: null, lng: null };

      /**
       * event came from route options component and
       * is already swapped when it reaches the
       * livemap component
       */
      let event = {
        source: source,
        sourceString: null,
        destination: destination,
        destString: "destination"
      };

      component.swap(event);

      expect(component.destination.lat).toEqual(10);
      expect(component.destination.lng).toEqual(20);
      expect(component.destString).toEqual("destination");
      expect(component.source.lat).toBeUndefined();
      expect(component.source.lng).toBeUndefined();
      expect(component.sourceString).toEqual("");
    });

    it("should assign both source and destination", () => {
      let source = { lat: 10, lng: 20 };
      let destination = { lat: 20, lng: 10 };

      /**
       * event came from route options component and
       * is already swapped when it reaches the
       * livemap component
       */
      let event = {
        source: source,
        sourceString: "source",
        destination: destination,
        destString: "destination"
      };

      component.swap(event);

      expect(component.source.lat).toEqual(10);
      expect(component.source.lng).toEqual(20);
      expect(component.sourceString).toEqual("source");
      expect(component.destination.lat).toEqual(20);
      expect(component.destination.lng).toEqual(10);
      expect(component.destString).toEqual("destination");
    });
  });

  describe("add home", () => {
    it("should add home to source", () => {
      let event = {
        pos: "source",
        home: { latitude: 10, longitude: 20 }
      };

      component.addHome(event);
      expect(component.source.lat).toEqual(10);
      expect(component.source.lng).toEqual(20);
    });
    it("should add home to destination", () => {
      let event = {
        pos: "destination",
        home: { latitude: 10, longitude: 20 }
      };

      component.addHome(event);
      expect(component.destination.lat).toEqual(10);
      expect(component.destination.lng).toEqual(20);
    });
  });

  describe("add work", () => {
    it("should add work to source", () => {
      let event = {
        pos: "source",
        work: { latitude: 10, longitude: 20 }
      };

      component.addWork(event);
      expect(component.source.lat).toEqual(10);
      expect(component.source.lng).toEqual(20);
    });
    it("should add work to destination", () => {
      let event = {
        pos: "destination",
        work: { latitude: 10, longitude: 20 }
      };

      component.addWork(event);
      expect(component.destination.lat).toEqual(10);
      expect(component.destination.lng).toEqual(20);
    });
  });

  describe("set location now", () => {
    it("should set lat and lng correctly", () => {
      let event = {
        source: { lat: 10, lng: 20 }
      };

      component.setLocationNow(event);

      expect(component.source.lat).toEqual(10);
      expect(component.source.lat).toEqual(10);
    });
  });

  describe("on route used", () => {
    it("should update source and destination", () => {
      let event = {
        source: { lat: 10, lng: 20 },
        destination: { lat: 20, lng: 10 }
      };

      component.onRouteUsed(event);

      expect(component.destination).toEqual({ lat: 20, lng: 10, label: "D" });
      expect(component.source).toEqual({ lat: 10, lng: 20, label: "S" });
      expect(component.sourceData).toEqual({ lat: 10, lng: 20, label: "S" });
      expect(component.destData).toEqual({ lat: 20, lng: 10, label: "D" });
    });
    it("should not update if null", () => {
      let event = {
        source: { lat: 10, lng: 20 },
        destination: { lat: null, lng: null }
      };

      component.onRouteUsed(event);

      expect(component.destination).toEqual({
        lat: undefined,
        lng: undefined
      });
      expect(component.source).toEqual({
        lat: undefined,
        lng: undefined
      });
      expect(component.sourceData).toEqual({
        lat: undefined,
        lng: undefined,
        label: "S"
      });
      expect(component.destData).toEqual({
        lat: undefined,
        lng: undefined,
        label: "D"
      });
    });
  });

  describe("source address change", () => {
    it("should update source correctly", () => {
      let event = {
        source: { lat: 10, lng: 20 },
        sourceString: "source"
      };

      component.sourceAddressChange(event);

      expect(component.source.lat).toEqual(10);
      expect(component.source.lng).toEqual(20);
      expect(component.sourceString).toEqual("source");
    });
  });

  describe("destination address change", () => {
    it("should update destination correctly", () => {
      let event = {
        destination: { lat: 10, lng: 20 },
        destString: "destination"
      };

      component.destinationAddressChange(event);

      expect(component.destination.lat).toEqual(10);
      expect(component.destination.lng).toEqual(20);
      expect(component.destString).toEqual("destination");
    });
  });

  describe("delete markers", () => {
    let event;
    beforeEach(() => {
      event = {
        routes: [
          {
            legs: [
              {
                distance: { text: "5km" },
                duration: { text: "23 mins" }
              }
            ]
          }
        ]
      };
    });

    it("should delete source and destination", () => {
      component.deleteMarkers(event);

      expect(component.source.lat).toBeUndefined();
      expect(component.source.lng).toBeUndefined();
      expect(component.destination.lat).toBeUndefined();
      expect(component.destination.lng).toBeUndefined();
    });

    it("should update distance and eta", () => {
      component.deleteMarkers(event);

      expect(component.distance).toEqual("5km");
      expect(component.eta).toEqual("23 mins");
    });
  });

  describe("map zoom change", () => {
    it("should update zoom", () => {
      component.mapZoomChange(19);
      expect(component.zoom).toEqual(19);
    });

    it("should not remove markers if zoom is near", () => {
      component.reportMarkers = [
        {
          lat: 1,
          lng: 2,
          type: 0,
          id: "bruh",
          autoOpen: false
        }
      ];
      component.adMarkers = [{ lat: 1, lng: 2, id: "bruh" }];

      component.mapZoomChange(19);
      expect(component.reportMarkers).toEqual([
        {
          lat: 1,
          lng: 2,
          type: 0,
          id: "bruh",
          autoOpen: false
        }
      ]);
      expect(component.adMarkers).toEqual([{ lat: 1, lng: 2, id: "bruh" }]);
    });

    it("should remove markers if zooms too far", () => {
      component.reportMarkers = [
        {
          lat: 1,
          lng: 2,
          type: 0,
          id: "bruh",
          autoOpen: false
        }
      ];
      component.adMarkers = [{ lat: 1, lng: 2, id: "bruh" }];

      component.mapZoomChange(13);
      expect(component.reportMarkers).toEqual([]);
      expect(component.adMarkers).toEqual([]);
    });
  });

  describe("add report to markers", () => {
    it("should add report to markers with position field", () => {
      let report = {
        position: {
          y: 1,
          x: 2
        },
        type: 0,
        id: "bruh",
        autoOpen: false
      };

      component.addReportToMarkers(report);

      expect(component.reportMarkers).toContain({
        lat: 1,
        lng: 2,
        type: 0,
        id: "bruh",
        autoOpen: false,
        label: "R"
      });
    });
  });
});
