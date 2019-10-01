import { RegisterComponent } from "./register.component";
import { Observable, throwError, of } from "rxjs";

describe("Register component", () => {
  let component: RegisterComponent;
  let mockUserService;
  let mockCookieService;
  let mockRouter;
  let mockToastr;

  beforeEach(() => {
    /**
     * Set up spies
     */
    mockUserService = jasmine.createSpyObj("mockUserService", ["registerUser"]);

    mockUserService.registerUser.and.callFake(data => {
      return of("done");
    });

    mockToastr = jasmine.createSpyObj("mockToastr", ["error"]);

    mockCookieService = jasmine.createSpyObj("mockCookieService", [
      "check",
      "delete",
      "set"
    ]);

    mockRouter = jasmine.createSpyObj("mockRouter", ["navigate"]);

    /**
     * Initialize component
     */
    component = new RegisterComponent(
      mockUserService,
      mockCookieService,
      mockRouter,
      mockToastr
    );

    /**
     * Set up attributes
     */
  });

  it("should say empty fields", () => {
    let data = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };

    component.onSubmit(data);

    expect(mockToastr.error).toHaveBeenCalledWith(
      "Please include complete details",
      "Error",
      { timeOut: 5000 }
    );
  });

  it("should say invalid email", () => {
    let data = {
      name: "bui",
      email: "no",
      password: "a",
      confirmPassword: "a"
    };

    component.onSubmit(data);

    expect(mockToastr.error).toHaveBeenCalledWith(
      "Please enter a valid Email address",
      "Error",
      { timeOut: 5000 }
    );
  });

  it("should say passwords don't match", () => {
    let data = {
      name: "bui",
      email: "n@o",
      password: "ab",
      confirmPassword: "a"
    };

    component.onSubmit(data);

    expect(mockToastr.error).toHaveBeenCalledWith(
      "Passwords don't match",
      "Error",
      { timeOut: 5000 }
    );
  });

  it("should navigate to login", () => {
    let data = {
      name: "bui",
      email: "n@o",
      password: "ab",
      confirmPassword: "ab"
    };

    component.onSubmit(data);

    expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
  });
});
