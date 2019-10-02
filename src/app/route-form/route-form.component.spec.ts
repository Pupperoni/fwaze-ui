import { RouteFormComponent } from "./route-form.component";

xdescribe("Route form component", () => {
  let component: RouteFormComponent;
  let mockCookieService;
  let mockToastr;

  beforeEach(() => {
    mockToastr = jasmine.createSpyObj("mockToastr", ["error"]);
    component = new RouteFormComponent(mockCookieService, mockToastr);
  });

  describe("source address change", () => {
    it("should update source string", () => {
      let event = {
        geometry: {
          location: {
            lat: function() {
              return 10;
            },
            lng: function() {
              return 20;
            }
          }
        },
        address_components: [
          { long_name: "this" },
          { long_name: "is" },
          { long_name: "a" },
          { long_name: "place" },
          { long_name: "lol" }
        ]
      };
      component.sourceAddressChange(event);

      expect(component.sourceString).toEqual("this, is, a, place, lol");
    });
  });

  describe("destination address change", () => {
    it("should update destination string", () => {
      let event = {
        geometry: {
          location: {
            lat: function() {
              return 10;
            },
            lng: function() {
              return 20;
            }
          }
        },
        address_components: [
          { long_name: "this" },
          { long_name: "is" },
          { long_name: "a" },
          { long_name: "place" },
          { long_name: "lol" }
        ]
      };

      component.destinationAddressChange(event);

      expect(component.destString).toEqual("this, is, a, place, lol");
    });
  });

  describe("current location button clicked", () => {
    it("should show error", () => {
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
