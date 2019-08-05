import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges
} from "@angular/core";

import { User } from "../user";
import { CookieService } from "ngx-cookie-service";

import { ReportService } from "../report.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-report-markers",
  templateUrl: "./report-markers.component.html",
  styleUrls: ["./report-markers.component.css"]
})
export class ReportMarkersComponent implements OnInit, OnChanges {
  @Input() toReset;
  currentUser: User = undefined;

  // markers for reports
  report_markers: ReportMarker[] = [];

  constructor(
    private reportService: ReportService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    // this.assignReportMarkers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    this.assignReportMarkers();
  }

  addVote(reportId: number, userId: number, iwindow) {
    const data = {
      report_id: reportId,
      user_id: userId
    };
    this.reportService.addVote(data).subscribe(res => {
      console.log(res);
      iwindow.close();
      // something changed - reset all :(
      this.assignReportMarkers();
      // iwindow.open();
    });
  }

  deleteVote(reportId: number, userId: number, iwindow) {
    const data = {
      report_id: reportId,
      user_id: userId
    };
    this.reportService.deleteVote(data).subscribe(res => {
      console.log(res);
      iwindow.close();
      // something changed - reset all :(
      this.assignReportMarkers();
      // iwindow.open();
    });
  }

  // Retrieve all reports and display on the map
  private assignReportMarkers() {
    // TO DO: Get only for the current border
    this.reportService.getAllReports().subscribe(res => {
      res.reports.forEach(report => {
        if (this.currentUser) {
          this.reportService
            .getUserVotePair(report.id, this.currentUser.id)
            .subscribe(res2 => {
              if (res2) {
                this.report_markers.push({
                  id: report.id,
                  lat: report.position.y,
                  lng: report.position.x,
                  type: report.type,
                  user_id: report.user_id,
                  user_name: report.name,
                  vote_count: report.votes,
                  cur_user_voted: true,
                  label: "R"
                });
              } else {
                this.report_markers.push({
                  id: report.id,
                  lat: report.position.y,
                  lng: report.position.x,
                  type: report.type,
                  user_id: report.user_id,
                  user_name: report.name,
                  vote_count: report.votes,
                  cur_user_voted: false,
                  label: "R"
                });
              }
            });
        } else {
          this.report_markers.push({
            id: report.id,
            lat: report.position.y,
            lng: report.position.x,
            type: report.type,
            user_id: report.user_id,
            user_name: report.name,
            vote_count: report.votes,
            cur_user_voted: true,
            label: "R"
          });
        }
      });
    });
  }
}

interface ReportMarker {
  id: number;
  lat: number;
  lng: number;
  type: number;
  user_id: number;
  user_name: string;
  vote_count: number;
  cur_user_voted: boolean;
  label?: string;
}
