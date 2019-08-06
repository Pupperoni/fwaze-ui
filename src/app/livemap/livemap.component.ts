import { Component, OnInit } from "@angular/core";

import { MouseEvent } from "@agm/core";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";
import { ReportService } from "../report.service";
import { AdvertisementService } from "../advertisement.service";
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
  public voteIncr;
  public voteDecr;

  // marker for reports
  report_markers: ReportMarker[] = [];

  // markers for ads
  ad_markers: adMarker[] = [];

  constructor(
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService,
    private reportService: ReportService,
    private advertisementService: AdvertisementService
  ) {
    this.currentMarkerService.reportSubmit$.subscribe(data => {
      this.reportSubmit = data;
      this.assignReportMarkers();
    });
    this.currentMarkerService.adSubmit$.subscribe(data => {
      this.adSubmit = data;
      this.assignAdMarkers();
    });
    this.currentMarkerService.voteIncr$.subscribe(data => {
      this.voteIncr = data;
      this.assignReportMarkers();
    });
    this.currentMarkerService.voteDecr$.subscribe(data => {
      this.voteDecr = data;
      this.assignReportMarkers();
    });
  }

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;

    this.assignReportMarkers();
    this.assignAdMarkers();
  }

  onMapClick($event: MouseEvent) {
    console.log("map clicked");
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

  addReportToMarkers(report, cur_user_voted) {
    this.report_markers.push({
      id: report.id,
      lat: report.position.y,
      lng: report.position.x,
      type: report.type,
      user_id: report.user_id,
      user_name: report.name,
      vote_count: report.votes,
      cur_user_voted: cur_user_voted ? true : false,
      label: "R"
    });
  }

  private assignReportMarkers() {
    this.report_markers = [];
    // TO DO: Get only for the current border
    this.reportService.getAllReports().subscribe(res => {
      res.reports.forEach(report => {
        if (this.currentUser) {
          this.reportService
            .getUserVotePair(report.id, this.currentUser.id)
            .subscribe(res2 => {
              this.addReportToMarkers(report, res2);
            });
        } else this.addReportToMarkers(report, false);
      });
    });
  }

  // Retrieve all ads and display on the map
  private assignAdMarkers() {
    this.ad_markers = [];
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
  id: string;
  lat: number;
  lng: number;
  type: number;
  user_id: number;
  user_name: string;
  vote_count: number;
  cur_user_voted: boolean;
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
