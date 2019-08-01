import { Component, OnInit, Input } from "@angular/core";
import { User } from "../user";
import { CookieService } from "ngx-cookie-service";

import { CurrentMarkerService } from "../current-marker.service";
import { ReportService } from "../report.service";

@Component({
  selector: "app-report-modal",
  templateUrl: "./report-modal.component.html",
  styleUrls: ["./report-modal.component.css"]
})
export class ReportModalComponent implements OnInit {
  currentUser: User = undefined;
  currentMarker: marker = undefined;

  // selected option for reports
  selectedOption: number = 0;
  constructor(
    private reportService: ReportService,
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;
  }

  reportSubmit() {
    this.currentMarker = this.currentMarkerService.getMarker();

    var reportSubmission = {
      type: this.selectedOption,
      user_id: this.currentUser.id,
      latitude: this.currentMarker.lat,
      longitude: this.currentMarker.lng
    };

    this.reportService.addReport(reportSubmission).subscribe(res => {
      console.log(res);
      this.selectedOption = 0;
      this.currentMarkerService.reportSubmit(reportSubmission);
    });
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
}
