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
      data.votes = 0;
      this.reportMarkers.push({
        id: data.id,
        lat: data.latitude,
        lng: data.longitude,
        type: data.type,
        label: "R"
      });
    });
    this.currentMarkerService.adSubmit$.subscribe(data => {
      this.adSubmit = data;
      this.adMarkers.push({
        id: data.id,
        lat: data.latitude,
        lng: data.longitude,
        label: "A"
      });
    });
    this.currentMarkerService.voteIncr$.subscribe(data => {
      this.voteIncr = data;
      this.updateReportMarker(data);
    });
    this.currentMarkerService.voteDecr$.subscribe(data => {
      this.voteDecr = data;
      this.updateReportMarker(data);
    });
  }

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;
  }

  ngOnChanges(change: SimpleChanges) {}

  onMapClick($event: MouseEvent) {
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

  mapPositionChange($event) {
    var tright = `${$event.na.l},${$event.ga.l}`;
    var bleft = `${$event.na.j},${$event.ga.j}`;

    console.log(tright);
    console.log(bleft);
    this.assignReportMarkers(tright, bleft);
    this.assignAdMarkers(tright, bleft);
  }

  addReportToMarkers(report) {
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
      if (this.currentUser) {
        this.reportService
          .getUserVotePair(updateReportId, this.currentUser.id)
          .subscribe(res2 => {
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

  private assignReportMarkers(tright, bleft) {
    this.reportService.getAllReportsByBounds(tright, bleft).subscribe(res => {
      // Clean up current report list
      for (var i = 0; i < this.reportMarkers.length; i++) {
        var toDelete = true;
        for (var j = 0; j < res.reports.length; j++) {
          if (this.reportMarkers[i].id === res.reports[j].id) {
            // element matched - don't delete as we will just render this again
            toDelete = false;
            break;
          }
        }
        // no element matched so we will remove it from the list
        if (toDelete) this.reportMarkers.splice(i, 1);
      }

      res.reports.forEach(report => {
        var toAdd = true;
        for (var i = 0; i < this.reportMarkers.length; i++) {
          // matched element - we don't add to avoid duplicates in the list
          if (this.reportMarkers[i].id === report.id) {
            toAdd = false;
            break;
          }
        }
        if (toAdd) this.addReportToMarkers(report);
      });
    });
  }

  // Retrieve all ads and display on the map
  private assignAdMarkers(tright, bleft) {
    this.advertisementService
      .getAllAdsByBounds(tright, bleft)
      .subscribe(res => {
        // Clean up current ads list
        for (var i = 0; i < this.adMarkers.length; i++) {
          var toDelete = true;
          for (var j = 0; j < res.ads.length; j++) {
            if (this.adMarkers[i].id === res.ads[j].id) {
              // element matched - don't delete as we will just render this again
              toDelete = false;
              break;
            }
          }
          // no element matched so we will remove it from the list
          if (toDelete) this.adMarkers.splice(i, 1);
        }

        res.ads.forEach(ad => {
          var toAdd = true;
          for (var i = 0; i < this.adMarkers.length; i++) {
            // matched element - we don't add to avoid duplicates in the list
            if (this.adMarkers[i].id === ad.id) {
              toAdd = false;
              break;
            }
          }
          if (toAdd) {
            this.adMarkers.push({
              id: ad.id,
              lat: ad.position.y,
              lng: ad.position.x,
              label: "A"
            });
          }
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
  id: string;
  lat: number;
  lng: number;
  label?: string;
}
