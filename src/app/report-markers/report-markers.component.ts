import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";

import { User } from "../user";
import { CookieService } from "ngx-cookie-service";
import { CurrentMarkerService } from "../current-marker.service";
import { ReportService } from "../report.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-report-markers",
  templateUrl: "./report-markers.component.html",
  styleUrls: ["./report-markers.component.css"]
})
export class ReportMarkersComponent implements OnInit {
  @Input() marker;
  @Input() index;
  commentUp = false;

  markerInfo = undefined;
  infoWindowOpen = false;

  currentUser: User = undefined;

  icon = undefined;

  constructor(
    private reportService: ReportService,
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService,
    private cdr: ChangeDetectorRef
  ) {}

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
    var subscriptionVal = this.reportService
      .getReportById(id)
      .subscribe((res: any) => {
        if (this.currentUser) {
          this.reportService
            .getUserVotePair(res.report.id, this.currentUser.id)
            .subscribe(res2 => {
              res.report.curUserVoted = res2 ? true : false;
              this.markerInfo = res.report;
              return true;
            });
        } else {
          res.report.curUserVoted = false;
          this.markerInfo = res.report;
          return true;
        }
      });
    return Promise.resolve(subscriptionVal);
  }

  toggleComments() {
    this.commentUp = !this.commentUp;
    this.cdr.detectChanges();
  }

  // Automatically open when updated from upvotes
  isWindowOpen(willOpen: boolean, window) {
    if (willOpen) {
      this.marker.autoOpen = false;
      this.toggleInfoWindow(this.marker.id).then(res => {
        window.open();
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
