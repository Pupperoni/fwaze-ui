import { NavbarComponent } from "./navbar.component";

describe("Navbar component", () => {
  let component: NavbarComponent;
  let mockUserService;
  let mockCookieService;
  let mockRouter;
  let mockCdr;
  let mockToastr;
  let mockEventService;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj("mockRouter", ["navigate"]);
    mockUserService = jasmine.createSpyObj("mockUserService", [
      "loginUserSocket"
    ]);
    mockCdr = jasmine.createSpyObj("mockCdr", ["detectChanges"]);
    mockCookieService = jasmine.createSpyObj("mockCookieService", ["delete"]);
    component = new NavbarComponent(
      mockUserService,
      mockCookieService,
      mockRouter,
      mockCdr,
      mockToastr,
      mockEventService
    );
  });

  describe("go to", () => {
    it("should navigate to user detail", () => {
      component.goTo("id");
      expect(mockRouter.navigate).toHaveBeenCalledWith(["/detail/id"]);
    });
  });

  describe("on logout", () => {
    it("should delete cookie", () => {
      component.onLogout();
      expect(mockCookieService.delete).toHaveBeenCalledWith("currentUser", "/");
    });

    it("should set current user to null", () => {
      component.onLogout();
      expect(component.currentUser).toBeNull();
    });
  });
});
