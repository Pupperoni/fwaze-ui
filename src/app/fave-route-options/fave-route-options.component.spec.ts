import { FaveRouteOptionsComponent } from "./fave-route-options.component";
import { of } from "rxjs";

describe("Fave route options", () => {
  let component: FaveRouteOptionsComponent;
  let mockCookieService;
  let mockUserService;
  let mockToastr;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj("mockUserService", [
      "addFaveRoute",
      "deleteFaveRoute"
    ]);

    mockToastr = jasmine.createSpyObj("mockToastr", ["success"]);

    mockUserService.addFaveRoute.and.callFake(data => {
      data.routeId = "bruh";
      let response = {
        data: data,
        msg: "Success"
      };
      return of(response);
    });

    mockUserService.deleteFaveRoute.and.callFake(data => {
      data.routeId = "bruh";
      let response = {
        data: data,
        msg: "Success"
      };
      return of(response);
    });

    component = new FaveRouteOptionsComponent(
      mockCookieService,
      mockUserService,
      mockToastr
    );
  });

  describe("use route", () => {
    beforeEach(() => {
      component.faveRoutes = [
        {
          destination_coords: {
            x: 10,
            y: 20
          },
          source_coords: {
            x: 20,
            y: 10
          },
          source_string: "route 1 src",
          destination_string: "route 1 dest"
        },
        {
          destination_coords: {
            x: 20,
            y: 40
          },
          source_coords: {
            x: 40,
            y: 20
          },

          source_string: "route 2 src",
          destination_string: "route 2 dest"
        },
        {
          destination_coords: {
            x: 5,
            y: 10
          },
          source_coords: {
            x: 10,
            y: 5
          },

          source_string: "route 3 src",
          destination_string: "route 3 dest"
        }
      ];
    });

    it("should set source and destination to route selected", () => {
      component.useRoute(0);

      expect(component.sourceString).toEqual("route 1 src");
      expect(component.destString).toEqual("route 1 dest");

      component.useRoute(1);

      expect(component.sourceString).toEqual("route 2 src");
      expect(component.destString).toEqual("route 2 dest");

      component.useRoute(2);

      expect(component.sourceString).toEqual("route 3 src");
      expect(component.destString).toEqual("route 3 dest");
    });
  });

  describe("save route", () => {
    it("should send route", () => {
      component.currentUser = {
        id: "userid",
        name: "my_name",
        email: "email",
        home: null,
        work: null,
        role: 0
      };

      component.sourceData = {
        lat: 10,
        lng: 20
      };
      component.destData = {
        lat: 20,
        lng: 10
      };

      component.sourceString = "source";
      component.destString = "dest";

      let event = { label: "my route" };

      component.saveRoute(event);

      expect(component.faveRoutes).toContain({
        id: "bruh",
        name: "my route",
        destination_coords: { x: 10, y: 20 },
        source_coords: { x: 20, y: 10 },
        destination_string: "dest",
        source_string: "source"
      });
    });
  });

  describe("delete route", () => {
    beforeEach(() => {
      component.currentUser = {
        id: "userid",
        name: "my_name",
        email: "email",
        home: null,
        work: null,
        role: 0
      };
      component.faveRoutes = [
        {
          destination_coords: {
            x: 10,
            y: 20
          },
          source_coords: {
            x: 20,
            y: 10
          },
          source_string: "route 1 src",
          destination_string: "route 1 dest"
        },
        {
          destination_coords: {
            x: 20,
            y: 40
          },
          source_coords: {
            x: 40,
            y: 20
          },

          source_string: "route 2 src",
          destination_string: "route 2 dest"
        },
        {
          destination_coords: {
            x: 5,
            y: 10
          },
          source_coords: {
            x: 10,
            y: 5
          },

          source_string: "route 3 src",
          destination_string: "route 3 dest"
        }
      ];
    });

    it("should say success", () => {
      component.selectedRoute = 0;
      component.deleteRoute();

      expect(mockToastr.success).toHaveBeenCalledWith(
        "Route has been successfully deleted",
        "Success",
        { timeOut: 5000 }
      );
    });

    it("should remove route", () => {
      component.selectedRoute = 0;
      component.deleteRoute();

      expect(component.faveRoutes.length).toEqual(2);
      expect(component.selectedRoute).toEqual(-1);

      component.selectedRoute = 0;
      component.deleteRoute();

      expect(component.faveRoutes.length).toEqual(1);
    });
  });
});
