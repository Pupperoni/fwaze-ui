import { Component, OnInit } from "@angular/core";

import { MouseEvent } from "@agm/core";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";
import { CurrentMarkerService } from "../current-marker.service";
@Component({
  selector: "app-livemap",
  templateUrl: "./livemap.component.html",
  styleUrls: ["./livemap.component.css"]
})
export class LivemapComponent implements OnInit {
  currentUser: User = undefined;

  // center of BGC
  lat: number = 14.5409;
  lng: number = 121.0503;
  zoom: number = 16;

  source: marker = undefined;
  destination: marker = undefined;

  // marker when clicking map (for reporting/making ad)
  public currentMarker: marker = undefined;
  public reportSubmit;
  public adSubmit;

  constructor(
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService
  ) {
    // this.currentMarkerService.currentMarker$.subscribe(marker => {
    //   this.currentMarker = marker;
    // });
    this.currentMarkerService.reportSubmit$.subscribe(data => {
      this.reportSubmit = data;
    });
    this.currentMarkerService.adSubmit$.subscribe(data => {
      this.adSubmit = data;
    });
  }

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;
  }

  onMapClick($event: MouseEvent) {
    console.log("map clicked");
    // this.currentMarkerService.currentMarker({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng
    // });
    this.currentMarkerService.setMarker({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
    this.currentMarker = this.currentMarkerService.getMarker();
  }

  toggleInfoWindow(cwindow) {
    if (cwindow != null) cwindow.close();
    else cwindow.open();
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
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
}
