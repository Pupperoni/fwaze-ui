import { RouteFormComponent } from "./route-form.component";

describe("Route form component", () => {
  let component: RouteFormComponent;
  let mockCookieService;
  let mockToastr;
  let mockGMapsService;
  let mockNavigator;

  beforeEach(() => {
    mockToastr = jasmine.createSpyObj("mockToastr", ["error"]);
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

    mockNavigator = jasmine.createSpyObj("mockNavigator", ["getNavigator"]);

    mockNavigator.getNavigator.and.callFake(() => {
      return {
        geolocation: {
          getCurrentPosition: function(callback) {
            let location = {
              coords: {
                latitude: 10,
                longitude: 20
              }
            };
            callback(location);
          }
        }
      };
    });

    component = new RouteFormComponent(
      mockCookieService,
      mockToastr,
      mockGMapsService,
      mockNavigator
    );
  });

  describe("current location button clicked", () => {
    it("should show error", () => {
      mockNavigator.getNavigator.and.callFake(() => {
        return {
          geolocation: null
        };
      });
      component.currentLocationButtonClicked();
      expect(mockToastr.error).toHaveBeenCalledWith(
        "Geolocation not supported by your browser. Considering updating your browser.",
        "Error",
        {
          timeOut: 5000
        }
      );
    });
  });
});
