import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../user";
import { CookieService } from "ngx-cookie-service";
import { AdvertisementService } from "../advertisement.service";

@Component({
  selector: "app-ad-markers",
  templateUrl: "./ad-markers.component.html",
  styleUrls: ["./ad-markers.component.css"]
})
export class AdMarkersComponent implements OnInit {
  currentUser: User = undefined;

  // markers for ads
  ad_markers: adMarker[] = [];
  adForm: FormGroup;
  constructor(
    private advertisementService: AdvertisementService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;
    this.assignAdMarkers();
    this.adForm = new FormGroup({
      caption: new FormControl("", [Validators.required])
    });
  }

  adSubmit(lat: number, lng: number, formData) {
    var adSubmission = {
      user_id: this.currentUser.id,
      caption: formData.caption,
      latitude: lat,
      longitude: lng
    };
    // console.log(adSubmission);
    this.advertisementService.addAd(adSubmission).subscribe(res => {
      console.log(res);
      this.assignAdMarkers();
    });
  }

  // Retrieve all ads and display on the map
  private assignAdMarkers() {
    this.advertisementService.getAllAds().subscribe(res => {
      res.ads.forEach(ad => {
        this.ad_markers.push({
          lat: ad.position.y,
          lng: ad.position.x,
          user_id: ad.user_id,
          user_name: ad.name,
          caption: ad.caption,
          label: "A"
        });
      });
    });
  }
}

interface adMarker {
  lat: number;
  lng: number;
  caption: string;
  user_id: number;
  user_name: string;
  label?: string;
}
