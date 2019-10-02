import { UserDetailComponent } from "./user-detail.component";
import { of, throwError } from "rxjs";
import { NavigationEnd } from "@angular/router";

let mockRoute: any = {
  snapshot: {
    paramMap: {
      get: attr => {
        return "someId";
      }
    }
  }
};

let mockRouter: any = {
  events: of(new NavigationEnd(0, "here", "there"))
};

describe("User detail", () => {
  let component: UserDetailComponent;
  let mockUserService;
  let mockApplicationService;
  let mockCookieService;
  let mockToastr;
  let mockEventService;

  beforeEach(() => {
    mockApplicationService = jasmine.createSpyObj("mockApplicationService", [
      "sendApplication"
    ]);

    mockToastr = jasmine.createSpyObj("mockToastr", ["success", "error"]);
    mockApplicationService.sendApplication.and.callFake(data => {
      if (data.userId === "invalid")
        return throwError({ error: { err: "This is so sad" } });
      return of(data);
    });

    mockUserService = jasmine.createSpyObj("mockUserService", ["getUser"]);
    mockUserService.getUser.and.callFake(id => {
      return of({
        user: {
          id: "someId",
          name: "someName",
          email: "email",
          home: { latitude: 20, longitude: 10, address: "my home" },
          work: { latitude: null, longitude: null, address: "" },
          role: 0
        }
      });
    });

    mockCookieService = jasmine.createSpyObj("mockCookieService", [
      "delete",
      "get",
      "set"
    ]);

    mockCookieService.get.and.callFake(id => {
      return JSON.stringify({
        id: "someId",
        name: "someName",
        email: "email",
        home: { latitude: 20, longitude: 10, address: "my home" },
        work: { latitude: null, longitude: null, address: "" },
        role: 0
      });
    });

    component = new UserDetailComponent(
      mockUserService,
      mockApplicationService,
      mockRoute,
      mockCookieService,
      mockRouter,
      mockToastr,
      mockEventService
    );
  });

  describe("get image path", () => {
    it("should return image", () => {
      component.userImage = "this is an image";
      expect(component.getImagePath()).toEqual("this is an image");
    });

    it("should append timestamp", () => {
      component.userImage = "this is an image";
      component.imageTimeStamp = "10:00:00";
      expect(component.getImagePath()).toEqual("this is an image?10:00:00");
    });
  });

  describe("apply advertiser", () => {
    beforeEach(() => {
      component.currentUser = {
        id: "userid",
        name: "my_name",
        email: "email",
        home: null,
        work: null,
        role: 0
      };
    });

    it("should send application", () => {
      component.applyAdvertiser();

      expect(mockApplicationService.sendApplication).toHaveBeenCalled();
    });

    it("should say success when sent", () => {
      component.applyAdvertiser();

      expect(mockToastr.success).toHaveBeenCalledWith(
        "Your application is now being processed",
        "Application Submitted!",
        {
          timeOut: 5000
        }
      );
    });

    it("should say error when not sent", () => {
      component.currentUser.id = "invalid";
      component.applyAdvertiser();

      expect(mockToastr.error).toHaveBeenCalledWith("This is so sad", "Error", {
        timeOut: 5000
      });
    });
  });

  describe("get user", () => {
    it("should update user", () => {
      component.currentUser = {
        id: "myId",
        name: "someName",
        email: "email",
        home: null,
        work: null,
        role: 0
      };
      component.getUser();

      expect(component.user).toEqual({
        id: "someId",
        name: "someName",
        email: "email",
        home: { latitude: 20, longitude: 10, address: "my home" },
        work: { latitude: null, longitude: null, address: "" },
        role: 0
      });

      expect(component.userImage).toEqual(
        "http://localhost:3002/users/someId/image"
      );
    });

    it("should update current user", () => {
      component.currentUser = {
        id: "someId",
        name: "someName",
        email: "email",
        home: { address: "", latitude: null, longitude: null },
        work: { address: "", latitude: null, longitude: null },
        role: 0
      };
      component.getUser();

      expect(component.currentUser).toEqual({
        id: "someId",
        name: "someName",
        email: "email",
        home: { latitude: 20, longitude: 10, address: "my home" },
        work: { latitude: null, longitude: null, address: "" },
        role: 0
      });
    });
  });
});
