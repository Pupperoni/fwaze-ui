import { Component, OnInit } from "@angular/core";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MouseEvent } from "@agm/core";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";
import { ReportService } from "../report.service";
import { Report } from "../report";
import { Advertisement } from "../advertisement";
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

  // markers for reports
  report_markers: ReportMarker[] = [];

  // markers for ads
  ad_markers: adMarker[] = [];

  // marker when clicking map (for reporting/making ad)
  currentMarker: marker = undefined;

  // selected option for reports
  selectedOption: number = 0;

  constructor(
    private reportService: ReportService,
    private advertisementService: AdvertisementService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;
    this.assignReportMarkers();
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

  onMarkerClick(index: number) {
    console.log(
      `marker at (${this.report_markers[index].lat},${
        this.report_markers[index].lng
      }) clicked.`
    );
    // this.report_markers.splice(index, 1);
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

  reportSubmit(lat: number, lng: number) {
    var reportSubmission = {
      type: this.selectedOption,
      user_id: this.currentUser.id,
      latitude: lat,
      longitude: lng
    };

    this.reportService.addReport(reportSubmission).subscribe(res => {
      console.log(res);
      this.assignReportMarkers();
      this.selectedOption = 0;
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

  // Retrieve all reports and display on the map
  private assignReportMarkers() {
    this.reportService.getAllReports().subscribe(res => {
      res.reports.forEach(report => {
        this.report_markers.push({
          lat: report.position.y,
          lng: report.position.x,
          type: report.type,
          user_id: report.user_id,
          user_name: report.name,
          label: "R"
        });
      });
    });
  }

  // Retrieve all reports and display on the map
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

interface ReportMarker {
  lat: number;
  lng: number;
  type: number;
  user_id: number;
  user_name: string;
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
