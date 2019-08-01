import { Component, OnInit } from "@angular/core";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MouseEvent } from "@agm/core";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";
import { AdvertisementService } from "../advertisement.service";

@Component({
  selector: "app-livemap",
  templateUrl: "./livemap.component.html",
  styleUrls: ["./livemap.component.css"]
})
export class LivemapComponent implements OnInit {
  currentUser: User = undefined;
  adForm: FormGroup;
  // center of BGC
  lat: number = 14.5409;
  lng: number = 121.0503;
  zoom: number = 16;

  source: marker = undefined;
  destination: marker = undefined;

  // markers for ads
  ad_markers: adMarker[] = [];

  // marker when clicking map (for reporting/making ad)
  currentMarker: marker = undefined;

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

  onMapClick($event: MouseEvent) {
    console.log("map clicked");
    this.currentMarker = {
      lat: $event.coords.lat,
      lng: $event.coords.lng
    };
  }

  sourceAddressChange($event) {
    this.source = {
      lat: $event.geometry.location.lat(),
      lng: $event.geometry.location.lng(),
      label: "S"
    };

    console.log(this.source);
    this.lat = this.source.lat;
    this.lng = this.source.lng;
  }

  destinationAddressChange($event) {
    this.destination = {
      lat: $event.geometry.location.lat(),
      lng: $event.geometry.location.lng(),
      label: "D"
    };
    console.log(this.destination);
    this.lat = this.destination.lat;
    this.lng = this.destination.lng;
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

interface marker {
  lat: number;
  lng: number;
  label?: string;
}

interface adMarker {
  lat: number;
  lng: number;
  caption: string;
  user_id: number;
  user_name: string;
  label?: string;
}
