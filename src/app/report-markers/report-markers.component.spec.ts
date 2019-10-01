import { ReportMarkersComponent } from "./report-markers.component";
import { ReportService } from "../report.service";
import { CommentService } from "../comment.service";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { EventService } from "../event.service";

import { of } from "rxjs";

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
      "getReportById",
      "addVote",
      "deleteVote",
      "getUserVotePair",
      "viewMarker"
    ]);

    mockCommentService = jasmine.createSpyObj("mockCommentService", [
      "getCommentsbyReport",
      "createComment",
      "countCommentsbyReport"
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
      return of({
        data: []
      });
    });

    // act
    component.changePage(1);

    // assert
    expect(component.pageNum).toEqual(1);
  });

  it("should submit comment", () => {
    // arrange
    mockCommentService.createComment.and.callFake(data => {
      return of({
        data: []
      });
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
      return of({
        data: []
      });
    });

    // act
    component.toggleComments();

    // assert
    expect(component.commentUp).toBeTruthy();
    expect(component.pageNum).toEqual(0);
  });

  it("should add vote", () => {
    // arrange
    mockReportService.addVote.and.callFake((id, page) => {
      return of({
        data: []
      });
    });

    let data = {
      reportId: "someReport",
      userId: "someUser"
    };

    // act
    component.addVote(data.reportId, data.userId);

    // assert
    expect(mockReportService.addVote).toHaveBeenCalled();
  });

  it("should delete vote", () => {
    // arrange
    mockReportService.deleteVote.and.callFake((id, page) => {
      return of({
        data: []
      });
    });

    let data = {
      reportId: "someReport",
      userId: "someUser"
    };

    // act
    component.deleteVote(data.reportId, data.userId);

    // assert
    expect(mockReportService.deleteVote).toHaveBeenCalled();
  });

  it("should create marker info", () => {
    // arrange
    mockReportService.getReportById.and.callFake(id => {
      return of({
        report: {
          id: "reportId",
          autoOpen: false,
          lat: 120,
          lng: -120,
          type: 2
        }
      });
    });

    mockCommentService.countCommentsbyReport.and.callFake(id => {
      return of({ data: 0 });
    });

    mockReportService.getUserVotePair.and.callFake((reportId, userId) => {
      return of("something");
    });

    // act
    component.toggleInfoWindow("reportId");

    // assert
    expect(component.markerInfo).toEqual({
      id: "reportId",
      autoOpen: false,
      lat: 120,
      lng: -120,
      type: 2,
      curUserVoted: true
    });
  });

  it("should get image", () => {
    // arrange
    mockReportService.getReportById.and.callFake(id => {
      return of({
        report: {
          id: "reportId",
          autoOpen: false,
          lat: 120,
          lng: -120,
          type: 2,
          photoPath: "cool_image.jpg"
        }
      });
    });

    mockCommentService.countCommentsbyReport.and.callFake(id => {
      return of({ data: 0 });
    });

    mockReportService.getUserVotePair.and.callFake((reportId, userId) => {
      return of("something");
    });

    // act
    component.toggleInfoWindow("reportId");

    // assert
    expect(component.imagePath).toEqual(
      "http://localhost:3001/map/reports/reportId/image"
    );
  });
});
