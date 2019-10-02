import { ReportModalComponent } from "./report-modal.component";
import { of } from "rxjs";

describe("Report modal component", () => {
  let component: ReportModalComponent;
  let mockReportService;
  let mockCookieService;
  let mockCurrentMarkerService;
  let mockToastr;
  let mockFormDataService;

  beforeEach(() => {
    mockReportService = jasmine.createSpyObj("mockReportService", [
      "addReport"
    ]);
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

    mockCurrentMarkerService = jasmine.createSpyObj(
      "mockCurrentMarkerService",
      ["getMarker", "getMarkerLocation"]
    );
    component = new ReportModalComponent(
      mockReportService,
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

  describe("report submit", () => {
    it("should say invalid image", () => {
      component.invalidImage = true;

      component.reportSubmit();

      expect(mockToastr.error).toHaveBeenCalledWith(
        "Please upload a valid image file",
        "Error",
        { timeOut: 5000 }
      );
    });

    it("should send valid data", () => {
      mockCurrentMarkerService.getMarker.and.returnValue({ lat: 10, lng: 20 });
      mockCurrentMarkerService.getMarkerLocation.and.returnValue(
        "location lol"
      );
      mockReportService.addReport.and.callFake(data => {
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

      component.reportSubmit();

      expect(mockReportService.addReport).toHaveBeenCalled();
    });
  });
});
