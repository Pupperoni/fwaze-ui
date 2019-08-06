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

  currentUser: User = undefined;

  constructor(
    private reportService: ReportService,
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
  }

  addVote(reportId: number, userId: number, iwindow) {
    console.log(this.index);
    const data = {
      reportId: reportId,
      userId: userId
    };
    this.reportService.addVote(data).subscribe(res => {
      console.log(res);
      // iwindow.close();
      this.currentMarkerService.voteIncr(this.index);
    });
  }

  deleteVote(reportId: number, userId: number, iwindow) {
    const data = {
      reportId: reportId,
      userId: userId
    };
    this.reportService.deleteVote(data).subscribe(res => {
      console.log(res);
      // iwindow.close();
      this.currentMarkerService.voteDecr(this.index);
    });
  }
}
