import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

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

  directionForm: FormGroup = undefined;
  sourceString = "";
  destString = "";
  // center of BGC
  lat: number = 14.5409;
  lng: number = 121.0503;
  zoom: number = 16;

  sourceData = undefined;
  destData = undefined;
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
    private advertisementService: AdvertisementService,
    private cdr: ChangeDetectorRef
  ) {
    this.directionForm = new FormGroup({
      source: new FormControl(""),
      destination: new FormControl("")
    });
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
      this.currentMarkerService.setMarker(undefined);
      this.currentMarker = this.currentMarkerService.getMarker();
    });
    this.currentMarkerService.adSubmit$.subscribe(data => {
      this.adSubmit = data;
      this.adMarkers.push({
        id: data.id,
        lat: data.latitude,
        lng: data.longitude,
        label: "A"
      });
      this.currentMarkerService.setMarker(undefined);
      this.currentMarker = this.currentMarkerService.getMarker();
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

  onMapClick($event: MouseEvent) {
    this.currentMarkerService.setMarker({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
    this.currentMarker = this.currentMarkerService.getMarker();
  }

  swap() {
    if (this.source && this.destination) {
      var bridge = JSON.parse(JSON.stringify(this.source));
      this.source = JSON.parse(JSON.stringify(this.destination));
      this.destination = JSON.parse(JSON.stringify(bridge));
    }
    if (this.sourceData && this.destData) {
      var bridge = JSON.parse(JSON.stringify(this.sourceData));
      this.sourceData = JSON.parse(JSON.stringify(this.destData));
      this.destData = JSON.parse(JSON.stringify(bridge));
    }

    this.directionForm.setValue({
      source: this.destString,
      destination: this.sourceString
    });
    var bridge2 = this.sourceString.slice(0);
    this.sourceString = this.destString.slice(0);
    this.destString = bridge2.slice(0);
    this.cdr.detectChanges();
  }

  sourceAddressChange($event) {
    console.log($event);
    this.source = {
      lat: $event.geometry.location.lat(),
      lng: $event.geometry.location.lng(),
      label: "S"
    };
    this.sourceData = {
      lat: $event.geometry.location.lat(),
      lng: $event.geometry.location.lng(),
      label: "S"
    };
    this.sourceString = "";
    for (var i = 0; i < $event.address_components.length; i++) {
      this.sourceString = this.sourceString.concat(
        $event.address_components[i].long_name
      );
      if (i != $event.address_components.length - 1)
        this.sourceString = this.sourceString.concat(", ");
    }
    this.lat = this.source.lat;
    this.lng = this.source.lng;
  }

  destinationAddressChange($event) {
    console.log($event);

    this.destination = {
      lat: $event.geometry.location.lat(),
      lng: $event.geometry.location.lng(),
      label: "D"
    };
    this.destData = {
      lat: $event.geometry.location.lat(),
      lng: $event.geometry.location.lng(),
      label: "D"
    };
    this.destString = "";
    for (var i = 0; i < $event.address_components.length; i++) {
      this.destString = this.destString.concat(
        $event.address_components[i].long_name
      );
      if (i != $event.address_components.length - 1)
        this.destString = this.destString.concat(", ");
    }
    this.lat = this.destination.lat;
    this.lng = this.destination.lng;
  }

  deleteMarkers($event) {
    this.source = undefined;
    this.destination = undefined;
    this.cdr.detectChanges();
  }

  // source: https://davidwalsh.name/javascript-debounce-function
  debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  mapPositionChange = this.debounce(
    function($event) {
      var tright = `${$event.na.l},${$event.ga.l}`;
      var bleft = `${$event.na.j},${$event.ga.j}`;
      this.assignReportMarkers(tright, bleft);
      this.assignAdMarkers(tright, bleft);
    },
    100,
    false
  );

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
      this.reportMarkers.push({
        id: res.report.id,
        lat: res.report.latitude,
        lng: res.report.longitude,
        type: res.report.type,
        label: "R"
      });
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
