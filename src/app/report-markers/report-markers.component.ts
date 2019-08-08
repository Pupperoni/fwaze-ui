import { Component, OnInit, Input } from "@angular/core";

import { User } from "../user";
import { CookieService } from "ngx-cookie-service";
import { CurrentMarkerService } from "../current-marker.service";
import { ReportService } from "../report.service";

@Component({
  selector: "app-report-markers",
  templateUrl: "./report-markers.component.html",
  styleUrls: ["./report-markers.component.css"]
})
export class ReportMarkersComponent implements OnInit {
  @Input() marker;
  @Input() index;

  markerInfo = undefined;
  infoWindowOpen = false;

  currentUser: User = undefined;

  icon = undefined;

  constructor(
    private reportService: ReportService,
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService
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

  toggleInfoWindow(id: string) {
    this.reportService.getReportById(id).subscribe((res: any) => {
      if (this.currentUser) {
        this.reportService
          .getUserVotePair(res.report.id, this.currentUser.id)
          .subscribe(res2 => {
            res.report.curUserVoted = res2 ? true : false;
            this.markerInfo = res.report;
          });
      } else {
        res.report.curUserVoted = false;
        this.markerInfo = res.report;
      }
    });
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
