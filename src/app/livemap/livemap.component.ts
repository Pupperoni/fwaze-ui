import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";

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
export class LivemapComponent implements OnInit, OnChanges {
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
  reportMarkers: ReportMarker[] = [];

  // markers for ads
  adMarkers: AdMarker[] = [];

  constructor(
    private cookieService: CookieService,
    private currentMarkerService: CurrentMarkerService,
    private reportService: ReportService,
    private advertisementService: AdvertisementService
  ) {
    this.currentMarkerService.reportSubmit$.subscribe(data => {
      this.reportSubmit = data;
      console.log(data);
      data.votes = 0;
      this.reportService.getUserVotePair(data.id, this.currentUser.id);
      this.reportMarkers.push({
        id: data.id,
        lat: data.latitude,
        lng: data.longitude,
        type: data.type,
        label: "R"
      });
    });
    // this.currentMarkerService.adSubmit$.subscribe(data => {
    //   this.adSubmit = data;
    //   this.assignAdMarkers();
    // });
    // this.currentMarkerService.voteIncr$.subscribe(data => {
    //   this.voteIncr = data;
    //   this.updateReportMarker(data);
    // });
    // this.currentMarkerService.voteDecr$.subscribe(data => {
    //   this.voteDecr = data;
    //   this.updateReportMarker(data);
    // });
  }

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;

    this.assignReportMarkers();
    this.assignAdMarkers();
  }

  ngOnChanges(change: SimpleChanges) {}

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

  addReportToMarkers(report, curUserVoted) {
    this.reportMarkers.push({
      id: report.id,
      lat: report.position.y || report.latitude,
      lng: report.position.x || report.longitude,
      type: report.type,
      label: "R"
    });
  }

  private updateReportMarker(index: number) {
    var updateReportId = this.reportMarkers.splice(index, 1)[0].id;

    this.reportService.getReportById(updateReportId).subscribe(res => {
      console.log(res);

      if (this.currentUser) {
        this.reportService
          .getUserVotePair(updateReportId, this.currentUser.id)
          .subscribe(res2 => {
            console.log(res2);
            if (res2) {
              this.reportMarkers.push({
                id: res.report.id,
                lat: res.report.latitude,
                lng: res.report.longitude,
                type: res.report.type,
                label: "R"
              });
            } else {
              this.reportMarkers.push({
                id: res.report.id,
                lat: res.report.latitude,
                lng: res.report.longitude,
                type: res.report.type,
                label: "R"
              });
            }
          });
      } else {
        this.reportMarkers.push({
          id: res.report.id,
          lat: res.report.latitude,
          lng: res.report.longitude,
          type: res.report.type,
          label: "R"
        });
      }
    });
  }

  private assignReportMarkers() {
    this.reportMarkers = [];
    // TO DO: Get only for the current border
    this.reportService.getAllReports().subscribe(res => {
      res.reports.forEach(report => {
        if (this.currentUser) {
          this.reportService
            .getUserVotePair(report.id, this.currentUser.id)
            .subscribe(res2 => {
              console.log(res2);
              this.addReportToMarkers(report, res2);
            });
        } else this.addReportToMarkers(report, false);
      });
    });
  }

  // Retrieve all ads and display on the map
  private assignAdMarkers() {
    this.adMarkers = [];
    this.advertisementService.getAllAds().subscribe(res => {
      res.ads.forEach(ad => {
        this.adMarkers.push({
          lat: ad.position.y,
          lng: ad.position.x,
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
  label?: string;
}

interface AdMarker {
  lat: number;
  lng: number;
  caption: string;
  label?: string;
}
