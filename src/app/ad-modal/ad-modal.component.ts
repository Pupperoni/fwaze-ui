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

  adSubmit(formData) {
    if (formData.caption == "") {
      // Can't have empty fields
      console.log("Empty field found");
    } else {
      // All good!

      this.currentMarker = this.currentMarkerService.getMarker();

      var adSubmission = {
        userId: this.currentUser.id,
        caption: formData.caption,
        latitude: this.currentMarker.lat,
        longitude: this.currentMarker.lng
      };
      this.advertisementService.addAd(adSubmission).subscribe((res: any) => {
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
