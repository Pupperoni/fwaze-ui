import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges
} from "@angular/core";

import { ReportService } from "../report.service";
@Component({
  selector: "app-report-markers",
  templateUrl: "./report-markers.component.html",
  styleUrls: ["./report-markers.component.css"]
})
export class ReportMarkersComponent implements OnInit, OnChanges {
  // markers for reports
  @Input() toReset;
  report_markers: ReportMarker[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.assignReportMarkers();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.assignReportMarkers();
  }

  // ngDoCheck() {
  //   this.assignReportMarkers();
  // }

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
