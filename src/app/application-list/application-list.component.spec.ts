import { ApplicationListComponent } from "./application-list.component";
import { of, throwError } from "rxjs";

describe("Application list component", () => {
  let component: ApplicationListComponent;
  let mockApplicationService;
  let mockCookieService;
  let mockToastr;
  let mockEventService;

  beforeEach(() => {
    mockApplicationService = jasmine.createSpyObj("mockApplicationService", [
      "approveApplication",
      "rejectApplication"
    ]);

    mockApplicationService.approveApplication.and.callFake(data => {
      if (data.userId === "invalid")
        return throwError({ error: { err: "This is so sad" } });
      return of("congrats");
    });

    mockApplicationService.rejectApplication.and.callFake(data => {
      if (data.userId == "invalid")
        return throwError({ error: { err: "This is so sad" } });
      return of("congrats");
    });

    mockToastr = jasmine.createSpyObj("mockToastr", ["error"]);

    component = new ApplicationListComponent(
      mockApplicationService,
      mockCookieService,
      mockToastr,
      mockEventService
    );
  });

  describe("toggle", () => {
    it("should change type of application", () => {
      expect(component.oldIsActive).toBeFalsy();
      expect(component.pendingIsActive).toBeTruthy();
      component.toggle("old");
      expect(component.oldIsActive).toBeTruthy();
      expect(component.pendingIsActive).toBeFalsy();
      component.toggle("pending");
      expect(component.oldIsActive).toBeFalsy();
      expect(component.pendingIsActive).toBeTruthy();
    });

    it("should do nothing if invalid", () => {
      expect(component.oldIsActive).toBeFalsy();
      expect(component.pendingIsActive).toBeTruthy();
      component.toggle("invalid");
      expect(component.oldIsActive).toBeFalsy();
      expect(component.pendingIsActive).toBeTruthy();
    });
  });

  describe("approve", () => {
    it("should say error", () => {
      component.pendingApplications = [{ id: "appId", status: 0 }];
      component.currentUser = {
        id: "userid",
        name: "my_name",
        email: "email",
        home: null,
        work: null,
        role: 0
      };

      component.approve("invalid", 0);
      expect(mockToastr.error).toHaveBeenCalledWith("This is so sad", "Error", {
        timeOut: 5000
      });
    });

    it("should approve", () => {
      component.pendingApplications = [{ id: "appId", status: 0 }];
      component.currentUser = {
        id: "userid",
        name: "my_name",
        email: "email",
        home: null,
        work: null,
        role: 0
      };
      component.approve("someUserId", 0);

      expect(component.pendingApplications).toEqual([]);
      expect(component.doneApplications).toEqual([{ id: "appId", status: 1 }]);
    });
  });

  describe("reject", () => {
    it("should say error", () => {
      component.pendingApplications = [{ id: "appId", status: 0 }];
      component.currentUser = {
        id: "userid",
        name: "my_name",
        email: "email",
        home: null,
        work: null,
        role: 0
      };

      component.reject("invalid", 0);
      expect(mockToastr.error).toHaveBeenCalledWith("This is so sad", "Error", {
        timeOut: 5000
      });
    });

    it("should reject", () => {
      component.pendingApplications = [{ id: "appId", status: 0 }];
      component.currentUser = {
        id: "userid",
        name: "my_name",
        email: "email",
        home: null,
        work: null,
        role: 0
      };
      component.reject("someUserId", 0);

      expect(component.pendingApplications).toEqual([]);
      expect(component.doneApplications).toEqual([{ id: "appId", status: -1 }]);
    });
  });
});
