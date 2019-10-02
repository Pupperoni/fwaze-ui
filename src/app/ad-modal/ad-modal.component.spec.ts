import { AdModalComponent } from "./ad-modal.component";
import { of } from "rxjs";

describe("Ad modal component", () => {
  let component: AdModalComponent;
  let mockAdvertisementService;
  let mockCookieService;
  let mockCurrentMarkerService;
  let mockToastr;
  let mockFormDataService;

  beforeEach(() => {
    mockAdvertisementService = jasmine.createSpyObj(
      "mockAdvertisementService",
      ["addAd"]
    );

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
    mockToastr = jasmine.createSpyObj("mockToastr", ["error"]);
    mockCurrentMarkerService = jasmine.createSpyObj(
      "mockCurrentMarkerService",
      ["getMarker", "getMarkerLocation"]
    );

    component = new AdModalComponent(
      mockAdvertisementService,
      mockCookieService,
      mockCurrentMarkerService,
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
      expect(component.photoUpload).toBeUndefined();
    });

    it("should save valid image", () => {
      let event = {
        target: {
          files: [{ name: "cheese", type: "image/png" }]
        }
      };
      component.handleFileInput(event);

      expect(component.invalidImage).toBeFalsy();
      expect(component.photoUpload).toEqual({
        name: "cheese",
        type: "image/png"
      });
    });
  });

  describe("ad submit", () => {
    beforeEach(() => {});

    it("should say include a caption when empty", () => {
      let formData = {
        caption: ""
      };

      component.adSubmit(formData);

      expect(mockToastr.error).toHaveBeenCalledWith(
        "Please include a caption",
        "Error",
        { timeOut: 5000 }
      );
    });

    it("should say invalid image", () => {
      let formData = {
        caption: "this is a caption"
      };
      component.invalidImage = true;

      component.adSubmit(formData);

      expect(mockToastr.error).toHaveBeenCalledWith(
        "Please upload a valid image file",
        "Error",
        { timeOut: 5000 }
      );
    });

    it("should upload valid form data", () => {
      mockCurrentMarkerService.getMarker.and.returnValue({ lat: 10, lng: 20 });
      mockCurrentMarkerService.getMarkerLocation.and.returnValue(
        "location lol"
      );
      mockAdvertisementService.addAd.and.callFake(data => {
        return of([data]);
      });
      component.currentUser = {
        id: "userid",
        name: "my_name",
        email: "email",
        home: null,
        work: null,
        role: 0
      };

      let formData = {
        caption: "this is a caption"
      };

      component.adSubmit(formData);

      expect(mockAdvertisementService.addAd).toHaveBeenCalled();
    });
  });
});
