import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { CookieService } from "ngx-cookie-service";

import { ReportService } from "../report.service";
@Component({
  selector: "app-report-markers",
  templateUrl: "./report-markers.component.html",
  styleUrls: ["./report-markers.component.css"]
})
export class ReportMarkersComponent implements OnInit {
  currentUser: User = undefined;

  // markers for reports
  report_markers: ReportMarker[] = [];

  // selected option for reports
  selectedOption: number = 0;
  constructor(
    private reportService: ReportService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;

    this.assignReportMarkers();
  }

  reportSubmit(lat: number, lng: number) {
    var reportSubmission = {
      type: this.selectedOption,
      user_id: this.currentUser.id,
      latitude: lat,
      longitude: lng
    };

    this.reportService.addReport(reportSubmission).subscribe(res => {
      console.log(res);
      this.assignReportMarkers();
      this.selectedOption = 0;
    });
  }

  // Retrieve all reports and display on the map
  private assignReportMarkers() {
    this.reportService.getAllReports().subscribe(res => {
      res.reports.forEach(report => {
        this.report_markers.push({
          lat: report.position.y,
          lng: report.position.x,
          type: report.type,
          user_id: report.user_id,
          user_name: report.name,
          label: "R"
        });
      });
    });
  }
}

interface ReportMarker {
  lat: number;
  lng: number;
  type: number;
  user_id: number;
  user_name: string;
  label?: string;
}
