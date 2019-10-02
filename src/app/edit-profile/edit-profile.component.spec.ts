import { EditProfileComponent } from "./edit-profile.component";
import { throwError, of } from "rxjs";

describe("Edit profile component", () => {
  let component: EditProfileComponent;
  let mockUserService;
  let mockCookieService;
  let mockRouter;
  let mockToastr;
  let mockFormDataService;

  beforeEach(() => {
    mockToastr = jasmine.createSpyObj("mockToastr", ["error"]);
    mockFormDataService = jasmine.createSpyObj("mockFormDataService", [
      "createForm"
    ]);
    mockFormDataService.createForm.and.callFake(() => {
      return {
        append: function(id, value, addtl = null) {
          this[id] = value;
        }
      };
    });

    mockUserService = jasmine.createSpyObj("mockUserService", ["updateUser"]);

    mockUserService.updateUser.and.callFake(data => {
      if (data.id === "invalid")
        return throwError({ error: { err: "This is so sad" } });
      else return of(data);
    });

    mockRouter = jasmine.createSpyObj("mockRouter", ["navigate"]);

    mockCookieService = jasmine.createSpyObj("mockCookieService", [
      "delete",
      "set"
    ]);

    component = new EditProfileComponent(
      mockUserService,
      mockCookieService,
      mockRouter,
      mockToastr,
      mockFormDataService
    );
  });

  describe("handle file input", () => {
    it("should not save invalid image", () => {
      let event = {
        target: {
          files: [{ data: "cheese", type: "invalid" }]
        }
      };

      component.handleFileInput(event);

      expect(component.invalidImage).toBeTruthy();
      expect(component.avatarUpload).toBeUndefined();
    });

    it("should save valid image", () => {
      let event = {
        target: {
          files: [{ name: "cheese", type: "image/png" }]
        }
      };
      component.handleFileInput(event);

      expect(component.invalidImage).toBeFalsy();
      expect(component.avatarUpload).toEqual({
        name: "cheese",
        type: "image/png"
      });
    });
  });

  describe("set home address", () => {
    it("should set homeSubmit to true", () => {
      expect(component.homeSubmit).toBeFalsy();
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

      component.setHomeAddress(event);

      expect(component.home).toEqual({
        latitude: 10,
        longitude: 20,
        address: "this, is, a, place, lol"
      });
      expect(component.homeSubmit).toBeTruthy();
    });
  });

  describe("set work address", () => {
    it("should set workSubmit to true", () => {
      expect(component.workSubmit).toBeFalsy();

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

      component.setWorkAddress(event);

      expect(component.work).toEqual({
        latitude: 10,
        longitude: 20,
        address: "this, is, a, place, lol"
      });
      expect(component.workSubmit).toBeTruthy();
    });
  });

  describe("validate email", () => {
    it("should say false when invalid", () => {
      expect(component.validateEmail("this is invalid")).toBeFalsy();
      expect(component.validateEmail("noatsign")).toBeFalsy();
    });

    it("should say true when valid", () => {
      expect(component.validateEmail("this@isvalid.com")).toBeTruthy();
      expect(component.validateEmail("johnLernom@email.valid")).toBeTruthy();
      expect(component.validateEmail("root@root")).toBeTruthy();
    });
  });

  describe("on submit", () => {
    it("should say invalid email", () => {
      let data = {
        email: "invalid",
        name: "name"
      };

      component.onSubmit(data);

      expect(mockToastr.error).toHaveBeenCalledWith(
        "Please enter a valid Email address",
        "Error",
        { timeOut: 5000 }
      );
    });

    it("should say invalid image", () => {
      let data = {
        email: "valid@email",
        name: "name"
      };

      component.invalidImage = true;

      component.onSubmit(data);

      expect(mockToastr.error).toHaveBeenCalledWith(
        "Please upload a valid image file",
        "Error",
        { timeOut: 5000 }
      );
    });

    it("should send with valid data", () => {
      component.currentUser = {
        id: "userid",
        name: "my_name",
        email: "email@email",
        home: null,
        work: null,
        role: 0
      };

      let data = {
        email: "valid@email",
        name: "name"
      };

      component.onSubmit(data);

      expect(mockRouter.navigate).toHaveBeenCalledWith(["/detail/userid"]);
    });

    it("should say error with invalid data", () => {
      component.currentUser = {
        id: "invalid",
        name: "my_name",
        email: "email@email",
        home: null,
        work: null,
        role: 0
      };

      let data = {
        email: "valid@email",
        name: "name"
      };

      component.onSubmit(data);

      expect(mockToastr.error).toHaveBeenCalledWith("This is so sad", "Error", {
        timeOut: 5000
      });
    });
  });
});
