import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { User } from "../user";
import { CookieService } from "ngx-cookie-service";
import { CurrentMarkerService } from "../current-marker.service";
import { ReportService } from "../report.service";
import { ToastrService } from "ngx-toastr";
import { FormDataService } from "../form-data.service";
@Component({
  selector: "app-report-modal",
  templateUrl: "./report-modal.component.html",
  styleUrls: ["./report-modal.component.css"]
})
export class ReportModalComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  currentUser: User = undefined;
  currentMarker: marker = undefined;
  invalidImage = false;
  photoUpload = undefined;

  // selected option for reports
  selectedOption: number = 0;
  selectedString: string = "Route type";

  constructor(
    private reportService: ReportService,
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService,
    private toastr: ToastrService,
    private formDataService: FormDataService
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

  updateSelect(index: number) {
    this.selectedOption = index;
    switch (index) {
      case 0:
        this.selectedString = "Traffic Jam";
        break;
      case 1:
        this.selectedString = "Heavy Traffic Jam";
        break;
      case 2:
        this.selectedString = "Police";
        break;
      case 3:
        this.selectedString = "Road Closed";
        break;
      case 4:
        this.selectedString = "Construction";
        break;
      case 5:
        this.selectedString = "Stopped Car";
        break;
      case 6:
        this.selectedString = "Minor Accident";
        break;
      case 7:
        this.selectedString = "Major Accident";
        break;
      case 8:
        this.selectedString = "Others";
        break;
    }
  }

  reportSubmit() {
    if (this.invalidImage) {
      this.toastr.error("Please upload a valid image file", "Error", {
        timeOut: 5000
      });
    } else {
      this.currentMarker = this.currentMarkerService.getMarker();
      let location = this.currentMarkerService.getMarkerLocation();
      let uploadData = this.formDataService.createForm();

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
        this.onSubmit.emit(res.data);
        this.photoUpload = null;
      });
    }
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
}
