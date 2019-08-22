import { Component, OnInit } from "@angular/core";
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

  photoUpload = undefined;

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

  handleFileInput($event) {
    if ($event.target.files.length > 0) {
      if (
        $event.target.files[0].type == "image/png" ||
        $event.target.files[0].type == "image/jpeg"
      )
        this.photoUpload = $event.target.files[0];
      else {
        console.log("File uploaded is not an image");
      }
    }
  }

  reportSubmit() {
    this.currentMarker = this.currentMarkerService.getMarker();
    let location = this.currentMarkerService.getMarkerAddress();
    let uploadData = new FormData();

    uploadData.append("type", this.selectedOption.toString());
    uploadData.append("userId", this.currentUser.id);
    uploadData.append("latitude", this.currentMarker.lat.toString());
    uploadData.append("longitude", this.currentMarker.lng.toString());
    uploadData.append("address", location);

    if (this.photoUpload)
      uploadData.append("photo", this.photoUpload, this.photoUpload.name);

    // let reportSubmission = {
    //   type: this.selectedOption,
    //   userId: this.currentUser.id,
    //   latitude: this.currentMarker.lat,
    //   longitude: this.currentMarker.lng
    // };

    this.reportService.addReport(uploadData).subscribe((res: any) => {
      this.selectedOption = 0;
      this.currentMarkerService.reportSubmit(res.data);
    });
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
}
