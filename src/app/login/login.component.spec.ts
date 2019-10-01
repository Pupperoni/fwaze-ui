import { LoginComponent } from "./login.component";
import { throwError, Observable } from "rxjs";

describe("Login component", () => {
  let component: LoginComponent;
  let mockUserService;
  let mockCookieService;
  let mockRouter;
  let mockToastr;

  beforeEach(() => {
    /**
     * Set up spies
     */
    mockUserService = jasmine.createSpyObj("mockUserService", [
      "loginUser",
      "loginUserSocket"
    ]);

    mockUserService.loginUser.and.callFake(data => {
      if (data.name === "wrong" || data.password === "information")
        return throwError({ error: { err: "Wrong information bro" } });
      else {
        return new Observable<any>();
      }
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
    component = new LoginComponent(
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
      password: ""
    };
    component.onSubmit(data);

    expect(mockToastr.error).toHaveBeenCalledWith(
      "Please include complete details",
      "Error",
      { timeOut: 5000 }
    );
  });

  //   it("should say incorrect details", () => {
  //     let data = {
  //       name: "wrong",
  //       password: "information"
  //     };
  //     try {
  //       component.onSubmit(data);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     expect(mockToastr.error).toHaveBeenCalled();
  //   });

  it("should navigate to home", () => {
    let data = {
      name: "nice",
      password: "name"
    };

    component.onSubmit(data);

    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
