import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../user";
import { CookieService } from "ngx-cookie-service";
import { CurrentMarkerService } from "../current-marker.service";
import { ReportService } from "../report.service";
import { CommentService } from "../comment.service";
import { Subscription } from "rxjs";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-report-markers",
  templateUrl: "./report-markers.component.html",
  styleUrls: ["./report-markers.component.css"]
})
export class ReportMarkersComponent implements OnInit {
  @Input() marker;
  @Input() index;
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

  constructor(
    private reportService: ReportService,
    private commentService: CommentService,
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService,
    private cdr: ChangeDetectorRef
  ) {
    this.commentForm = new FormGroup({
      body: new FormControl("")
    });
  }

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));

    this.icon = {
      url: `../../assets/report${this.marker.type}.png`,
      scaledSize: {
        width: 30,
        height: 30
      }
    };
  }

  toggleInfoWindow(id: string): Promise<Subscription> {
    let subscriptionVal = this.reportService
      .getReportById(id)
      .subscribe((res: any) => {
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
                this.imagePath = `http://localhost:3000/map/reports/${
                  this.markerInfo.id
                }/image`;
              return true;
            });
        } else {
          res.report.curUserVoted = false;
          this.markerInfo = res.report;
          if (this.markerInfo.photoPath)
            this.imagePath = `http://localhost:3000/map/reports/${
              this.markerInfo.id
            }/image`;
          return true;
        }
      });
    return Promise.resolve(subscriptionVal);
  }

  toggleComments() {
    this.commentList = [];
    this.commentUp = !this.commentUp;
    if (this.commentUp) {
      this.commentService
        .getCommentsbyReport(this.marker.id, this.pageNum)
        .subscribe((res: any) => {
          res.data.forEach(comment => {
            comment.userId = comment.user_id;
            this.commentList.push(comment);
          });
        });
      this.cdr.detectChanges();
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
          this.commentList.push(comment);
        });
      });
    this.cdr.detectChanges();
  }

  onSubmit(data) {
    data.reportId = this.marker.id;
    data.userId = this.currentUser.id;
    data.userName = this.currentUser.name;
    let dateNow = new Date();
    // format date >:(
    data.timestamp = `${dateNow.getFullYear()}-${dateNow.getMonth() +
      1}-${dateNow.getDate()} ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}.${dateNow.getMilliseconds()}`;

    if (data.body == "") {
      console.log("Missing comment text");
      alert("Missing comment text");
    } else {
      this.commentService.createComment(data).subscribe((res: any) => {
        this.commentService
          .countCommentsbyReport(data.reportId)
          .subscribe((count: any) => {
            this.maxPages = Math.ceil(count.data / 5);
            this.commentForm.setValue({
              body: ""
            });
            // After adding comment, go to the first page again
            this.changePage(0);
          });
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

  addVote(reportId: number, userId: number) {
    const data = {
      reportId: reportId,
      userId: userId
    };
    this.reportService.addVote(data).subscribe(res => {
      this.currentMarkerService.voteIncr(this.index);
    });
  }

  deleteVote(reportId: number, userId: number) {
    const data = {
      reportId: reportId,
      userId: userId
    };
    this.reportService.deleteVote(data).subscribe(res => {
      this.currentMarkerService.voteDecr(this.index);
    });
  }
}
