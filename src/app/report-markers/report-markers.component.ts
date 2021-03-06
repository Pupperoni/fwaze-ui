import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  OnDestroy
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { User } from "../user";
import { CookieService } from "ngx-cookie-service";
import { ReportService } from "../report.service";
import { CommentService } from "../comment.service";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { EventService } from "../event.service";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-report-markers",
  templateUrl: "./report-markers.component.html",
  styleUrls: ["./report-markers.component.css"]
})
export class ReportMarkersComponent implements OnInit, OnDestroy {
  @Input() marker;
  @Input() index;
  @Output() onUpVote = new EventEmitter();
  @Output() onDownVote = new EventEmitter();
  commentUp = false;
  commentForm: FormGroup;
  imagePath = undefined;
  pageNum = 0;
  maxPages = undefined;
  markerInfo = undefined;
  infoWindowOpen = false;
  commentList = [];
  currentUser: User = undefined;
  icon = undefined;

  voteCreatedSub: Subscription;
  voteDeletedSub: Subscription;
  commentCreatedSub: Subscription;

  constructor(
    private reportService: ReportService,
    private commentService: CommentService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private eventService: EventService
  ) {
    this.commentForm = new FormGroup({
      body: new FormControl("")
    });
  }

  ngOnInit() {
    // could move these to livemap component
    this.voteCreatedSub = this.eventService
      .getReportVoteCreatedEvents()
      .subscribe(report => {
        // console.log("upvoted");
        if (this.markerInfo) {
          if (report.id === this.markerInfo.id) {
            this.markerInfo.offset = report.offset;
            this.markerInfo.votes++;
            if (report.userId === this.currentUser.id)
              this.markerInfo.curUserVoted = true;
          }
        }
      });

    this.voteDeletedSub = this.eventService
      .getReportVoteDeletedEvents()
      .subscribe(report => {
        // console.log("downvoted");
        if (this.markerInfo) {
          if (report.id === this.markerInfo.id) {
            this.markerInfo.offset = report.offset;
            this.markerInfo.votes--;
            if (report.userId === this.currentUser.id)
              this.markerInfo.curUserVoted = false;
          }
        }
      });

    this.commentCreatedSub = this.eventService
      .getReportCommentCreatedEvents()
      .subscribe(comment => {
        if (this.markerInfo) {
          if (comment.reportId === this.markerInfo.id) {
            this.markerInfo.offset = comment.offset;

            if (this.commentUp) {
              // count new ones
              this.commentService
                .countCommentsbyReport(comment.reportId)
                .subscribe((count: any) => {
                  this.maxPages = Math.ceil(count.data / 5);
                });
              // will get problems if net is slow
              this.changePage(this.pageNum);
            }
          }
        }
      });

    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));

    this.icon = {
      url: `../../assets/report${this.marker.type}.png`,
      scaledSize: {
        width: 30,
        height: 30
      }
    };
  }

  ngOnDestroy() {
    this.voteCreatedSub.unsubscribe();
    this.voteDeletedSub.unsubscribe();
    this.commentCreatedSub.unsubscribe();
  }

  onWindowClose() {
    if (this.markerInfo)
      this.reportService.leaveMarker(this.marker.id, this.markerInfo.offset);
  }

  toggleInfoWindow(id: string): Promise<Subscription> {
    let subscriptionVal = this.reportService
      .getReportById(id)
      .subscribe((res: any) => {
        // enter room that views this marker
        this.reportService.viewMarker(id, res.report.offset);
        this.commentService
          .countCommentsbyReport(id)
          .subscribe((count: any) => {
            this.maxPages = Math.ceil(count.data / 5);
          });

        if (this.currentUser) {
          this.reportService
            .getUserVotePair(res.report.id, this.currentUser.id)
            .subscribe(res2 => {
              res.report.curUserVoted = res2 ? true : false;
              this.markerInfo = res.report;
              if (this.markerInfo.photoPath)
                this.imagePath = `http://${environment.RMSAPIUrl.HOST}:${environment.RMSAPIUrl.PORT}/map/reports/${this.markerInfo.id}/image`;
              return true;
            });
        } else {
          res.report.curUserVoted = false;
          this.markerInfo = res.report;
          if (this.markerInfo.photoPath)
            this.imagePath = `http:/${environment.RMSAPIUrl.HOST}:${environment.RMSAPIUrl.PORT}/map/reports/${this.markerInfo.id}/image`;
          return true;
        }
      });
    return Promise.resolve(subscriptionVal);
  }

  toggleComments() {
    this.commentUp = !this.commentUp;
    if (this.commentUp) {
      this.changePage(0);
    }
  }

  changePage(num: number) {
    this.pageNum = num;
    this.commentList = [];
    this.commentService
      .getCommentsbyReport(this.marker.id, this.pageNum)
      .subscribe((res: any) => {
        res.data.forEach(comment => {
          comment.userId = comment.user_id;
          // process timestamp to remove what possibly changes timezone
          comment.created_at = comment.created_at.replace("T", " ");
          comment.created_at = comment.created_at.replace(".000Z", "");
          this.commentList.push(comment);
        });
      });
  }

  onSubmit(data) {
    data.reportId = this.marker.id;
    data.userId = this.currentUser.id;
    data.userName = this.currentUser.name;
    let dateNow = new Date();
    // format date >:(
    data.timestamp = `${dateNow.getFullYear()}-${dateNow.getMonth() +
      1}-${dateNow.getDate()} ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}.${dateNow.getMilliseconds()}`;

    if (data.body === "") {
      this.toastr.error("Please include a comment", "Error", {
        timeOut: 5000
      });
    } else {
      this.commentService.createComment(data).subscribe((res: any) => {
        // this.commentService.createCommentSocket(data);
        this.commentForm.setValue({ body: "" });
      });
    }
  }

  // Automatically open when updated from upvotes
  isWindowOpen(willOpen: boolean, window) {
    if (willOpen) {
      this.marker.autoOpen = false;
      this.toggleInfoWindow(this.marker.id).then(res => {
        return willOpen;
      });
    }
  }

  addVote(reportId: string, userId: string) {
    const data = {
      reportId: reportId,
      userId: userId
    };
    this.reportService.addVote(data).subscribe((res: any) => {
      // this.currentMarkerService.voteIncr(this.index, res.data);
      this.onUpVote.emit({ index: this.index, data: res.data });
    });
  }

  deleteVote(reportId: string, userId: string) {
    const data = {
      reportId: reportId,
      userId: userId
    };
    this.reportService.deleteVote(data).subscribe((res: any) => {
      // this.currentMarkerService.voteDecr(this.index, res.data);
      this.onDownVote.emit({ index: this.index, data: res.data });
    });
  }
}
