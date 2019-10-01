import { ReportMarkersComponent } from "./report-markers.component";
import { ReportService } from "../report.service";
import { CommentService } from "../comment.service";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { EventService } from "../event.service";

import { Observable } from "rxjs";

// class MockReportService extends ReportService {}
// class MockCommentService extends CommentService {}
// class MockCookieService extends CookieService {}
// class MockToastr extends ToastrService {}
// class MockEventService extends EventService {}

describe("Report markers component", () => {
  let component: ReportMarkersComponent;
  let mockReportService;
  let mockCommentService;
  let mockCookieService;
  let mockToastr;
  let mockEventService;

  beforeEach(() => {
    /**
     * Set up spy objects
     */
    mockReportService = jasmine.createSpyObj("mockReportService", [
      "getReportById"
    ]);

    mockCommentService = jasmine.createSpyObj("mockCommentService", [
      "getCommentsbyReport",
      "createComment"
    ]);

    mockToastr = jasmine.createSpyObj("mockToastr", ["error"]);

    /**
     * Initialize component
     */
    component = new ReportMarkersComponent(
      mockReportService,
      mockCommentService,
      mockCookieService,
      mockToastr,
      mockEventService
    );

    /**
     * Set up component attributes
     */
    component.marker = {
      id: "reportId",
      autoOpen: false,
      lat: 120,
      lng: -120,
      type: 2
    };

    component.currentUser = {
      id: "someUser",
      name: "user",
      role: 0,
      email: "email@no.com",
      home: null,
      work: null
    };
  });

  it("should have a closed window", () => {
    expect(component.infoWindowOpen).toBeFalsy();
  });

  it("should start at page 0", () => {
    expect(component.pageNum).toEqual(0);
  });

  it("should change page to 1", () => {
    // arrange
    mockCommentService.getCommentsbyReport.and.callFake((id, page) => {
      let obs$ = new Observable<any>();
      return obs$;
    });

    // act
    component.changePage(1);

    // assert
    expect(component.pageNum).toEqual(1);
  });

  it("should submit comment", () => {
    // arrange
    mockCommentService.createComment.and.callFake(data => {
      let obs$ = new Observable<any>();
      return obs$;
    });

    let data = {
      body: "this is a comment"
    };

    // act
    component.onSubmit(data);

    // assert
    expect(mockCommentService.createComment).toHaveBeenCalled();
  });

  it("should display error with empty body", () => {
    // arrange

    let data = {
      body: ""
    };

    // act
    component.onSubmit(data);

    // assert
    expect(mockToastr.error).toHaveBeenCalledWith(
      "Please include a comment",
      "Error",
      { timeOut: 5000 }
    );
  });

  it("should open comment list", () => {
    // arrange
    mockCommentService.getCommentsbyReport.and.callFake((id, page) => {
      let obs$ = new Observable<any>();
      return obs$;
    });

    // act
    component.toggleComments();

    // assert
    expect(component.commentUp).toBeTruthy();
  });
});
