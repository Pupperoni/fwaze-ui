import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { User } from "../user";
import { AdvertisementService } from "../advertisement.service";
import { CookieService } from "ngx-cookie-service";
import { CurrentMarkerService } from "../current-marker.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { FormDataService } from "../form-data.service";

@Component({
  selector: "app-ad-modal",
  templateUrl: "./ad-modal.component.html",
  styleUrls: ["./ad-modal.component.css"]
})
export class AdModalComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  currentUser: User = undefined;
  currentMarker: marker = undefined;
  photoUpload = undefined;
  invalidImage = false;
  adForm: FormGroup;

  constructor(
    private advertisementService: AdvertisementService,
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService,
    private toastr: ToastrService,
    private formDataService: FormDataService
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;
    this.adForm = new FormGroup({
      caption: new FormControl("", [Validators.required])
    });
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

  adSubmit(formData) {
    if (formData.caption == "") {
      // Can't have empty fields
      this.toastr.error("Please include a caption", "Error", {
        timeOut: 5000
      });
    } else if (this.invalidImage) {
      this.toastr.error("Please upload a valid image file", "Error", {
        timeOut: 5000
      });
    } else {
      // All good!
      this.currentMarker = this.currentMarkerService.getMarker();
      let location = this.currentMarkerService.getMarkerLocation();
      let uploadData = this.formDataService.createForm();

      uploadData.append("userId", this.currentUser.id);
      uploadData.append("userName", this.currentUser.name);
      uploadData.append("caption", formData.caption);
      uploadData.append("latitude", this.currentMarker.lat.toString());
      uploadData.append("longitude", this.currentMarker.lng.toString());
      uploadData.append("location", location);

      if (this.photoUpload)
        uploadData.append("photo", this.photoUpload, this.photoUpload.name);

      this.advertisementService.addAd(uploadData).subscribe((res: any) => {
        this.onSubmit.emit(res.data);
        this.photoUpload = null;
      });
    }
  }
  get caption() {
    return this.adForm.get("caption");
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
}
