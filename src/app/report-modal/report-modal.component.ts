import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { CookieService } from "ngx-cookie-service";
import { CurrentMarkerService } from "../current-marker.service";
import { ReportService } from "../report.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-report-modal",
  templateUrl: "./report-modal.component.html",
  styleUrls: ["./report-modal.component.css"]
})
export class ReportModalComponent implements OnInit {
  currentUser: User = undefined;
  currentMarker: marker = undefined;
  invalidImage = false;
  photoUpload = undefined;

  // selected option for reports
  selectedOption: number = 0;
  constructor(
    private reportService: ReportService,
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;
  }

  handleFileInput($event) {
    if ($event.target.files.length > 0) {
      if (
        $event.target.files[0].type == "image/png" ||
        $event.target.files[0].type == "image/jpeg"
      ) {
        this.invalidImage = false;
        this.photoUpload = $event.target.files[0];
      } else {
        this.invalidImage = true;
      }
    }
  }

  reportSubmit() {
    if (this.invalidImage) {
      this.toastr.error(
        "Please upload a valid image file",
        "Invalid image format",
        { timeOut: 5000 }
      );
    }
    this.currentMarker = this.currentMarkerService.getMarker();
    let location = this.currentMarkerService.getMarkerLocation();
    let uploadData = new FormData();

    uploadData.append("type", this.selectedOption.toString());
    uploadData.append("userId", this.currentUser.id);
    uploadData.append("userName", this.currentUser.name);
    uploadData.append("latitude", this.currentMarker.lat.toString());
    uploadData.append("longitude", this.currentMarker.lng.toString());
    uploadData.append("location", location);

    if (this.photoUpload)
      uploadData.append("photo", this.photoUpload, this.photoUpload.name);

    this.reportService.addReport(uploadData).subscribe((res: any) => {
      this.selectedOption = 0;
      this.currentMarkerService.reportSubmit(res.data);
      this.photoUpload = null;
    });
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
}
