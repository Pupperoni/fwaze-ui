import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { AdvertisementService } from "../advertisement.service";
import { CookieService } from "ngx-cookie-service";

import { CurrentMarkerService } from "../current-marker.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-ad-modal",
  templateUrl: "./ad-modal.component.html",
  styleUrls: ["./ad-modal.component.css"]
})
export class AdModalComponent implements OnInit {
  currentUser: User = undefined;
  currentMarker: marker = undefined;
  photoUpload = undefined;
  adForm: FormGroup;

  constructor(
    private advertisementService: AdvertisementService,
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
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
      )
        this.photoUpload = $event.target.files[0];
      else {
        console.log("File uploaded is not an image");
      }
    }
  }

  adSubmit(formData) {
    if (formData.caption == "") {
      // Can't have empty fields
      console.log("Empty field found");
    } else {
      // All good!
      this.currentMarker = this.currentMarkerService.getMarker();
      let location = this.currentMarkerService.getMarkerAddress();
      let uploadData = new FormData();

      uploadData.append("userId", this.currentUser.id);
      uploadData.append("caption", formData.caption);
      uploadData.append("latitude", this.currentMarker.lat.toString());
      uploadData.append("longitude", this.currentMarker.lng.toString());
      uploadData.append("address", location);

      if (this.photoUpload)
        uploadData.append("photo", this.photoUpload, this.photoUpload.name);

      // let adSubmission = {
      //   userId: this.currentUser.id,
      //   caption: formData.caption,
      //   latitude: this.currentMarker.lat,
      //   longitude: this.currentMarker.lng
      // };
      this.advertisementService.addAd(uploadData).subscribe((res: any) => {
        this.currentMarkerService.adSubmit(res.data);
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
