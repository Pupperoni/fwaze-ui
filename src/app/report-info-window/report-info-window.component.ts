import { Component, OnInit, Input } from "@angular/core";

import { ReportService } from "../report.service";
@Component({
  selector: "app-report-info-window",
  templateUrl: "./report-info-window.component.html",
  styleUrls: ["./report-info-window.component.css"]
})
export class ReportInfoWindowComponent implements OnInit {
  @Input() markerId;
  constructor(private reportService: ReportService) {}

  ngOnInit() {}
}
