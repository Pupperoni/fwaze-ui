import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { MouseEvent } from "@agm/core";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";
import { ReportService } from "../report.service";
import { AdvertisementService } from "../advertisement.service";
import { CurrentMarkerService } from "../current-marker.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-livemap",
  templateUrl: "./livemap.component.html",
  styleUrls: ["./livemap.component.css"]
})
export class LivemapComponent implements OnInit {
  currentUser: User = undefined;
  tright = undefined;
  bleft = undefined;
  distance = undefined;
  eta = undefined;

  reportFilter = true;
  adFilter = true;

  filterList = [
    { name: "Traffic Jam", apiName: "traffic_jam", active: true },
    { name: "Heavy Traffic Jam", apiName: "heavy_traffic_jam", active: true },
    { name: "Police", apiName: "police", active: true },
    { name: "Road Closed", apiName: "closed_road", active: true },
    { name: "Car Stopped", apiName: "car_stopped", active: true },
    { name: "Construction", apiName: "construction", active: true },
    { name: "Minor Accident", apiName: "minor_accident", active: true },
    { name: "Major Accident", apiName: "major_accident", active: true },
    { name: "Others", apiName: "others", active: true }
  ];

  directionForm: FormGroup = undefined;
  sourceString = "";
  destString = "";
  // center of BGC
  lat: number = 14.5349;
  lng: number = 121.0403;
  zoom: number = 18;

  sourceData = {
    lat: undefined,
    lng: undefined,
    label: "S"
  };
  destData = {
    lat: undefined,
    lng: undefined,
    label: "D"
  };
  source: marker = {
    lat: undefined,
    lng: undefined
  };
  destination: marker = {
    lat: undefined,
    lng: undefined
  };

  // marker when clicking map (for reporting/making ad)
  public currentMarker: marker = undefined;

  // event seekers
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
        autoOpen: false,
        lat: data.latitude,
        lng: data.longitude,
        type: data.type
      });
      this.currentMarkerService.setMarker(undefined);
      this.currentMarker = this.currentMarkerService.getMarker();
    });
    this.currentMarkerService.adSubmit$.subscribe(data => {
      this.adSubmit = data;
      this.adMarkers.push({
        id: data.id,
        lat: data.latitude,
        lng: data.longitude
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

  // Removes elements from reportMarkers not in wantedList and push new elements from wantedList
  updateReportList(wantedList) {
    var indexToBeDeleted = [];
    // Clean up current report list
    for (var i = 0; i < this.reportMarkers.length; i++) {
      var toDelete = true;
      for (var j = 0; j < wantedList.length; j++) {
        if (this.reportMarkers[i].id === wantedList[j].id) {
          // element matched - don't delete as we will just render this again
          toDelete = false;
          break;
        }
      }
      // no element matched so we will remove it from the list
      if (toDelete) {
        indexToBeDeleted.splice(0, 0, i);
      }
    }

    indexToBeDeleted.forEach(index => {
      this.reportMarkers.splice(index, 1);
    });

    wantedList.forEach(report => {
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
  }

  onFilterSubmit($event) {
    console.log($event);
    this.filterList = $event.type;
    this.reportFilter = $event.group[0];
    this.adFilter = $event.group[1];

    if (!this.reportFilter) {
      this.reportMarkers = [];
    } else {
      this.assignReportMarkersProto();
    }

    if (!this.adFilter) {
      this.adMarkers = [];
    } else {
      this.assignAdMarkers(this.tright, this.bleft);
    }
  }

  swap() {
    var sourceCopy = JSON.parse(JSON.stringify(this.sourceData));
    var destCopy = JSON.parse(JSON.stringify(this.destData));
    if (this.sourceData.lat && this.destData.lat) {
      this.source = JSON.parse(JSON.stringify(destCopy));
      this.sourceData = JSON.parse(JSON.stringify(destCopy));
      this.destination = JSON.parse(JSON.stringify(sourceCopy));
      this.destData = JSON.parse(JSON.stringify(sourceCopy));
      var bridge2 = this.sourceString.slice(0);
      this.sourceString = this.destString.slice(0);
      this.destString = bridge2.slice(0);
    } else if (this.sourceData.lat) {
      this.destination = JSON.parse(JSON.stringify(sourceCopy));
      this.destData = JSON.parse(JSON.stringify(sourceCopy));
      this.destination.label = "D";
      this.destData.label = "D";

      this.source = {
        lat: undefined,
        lng: undefined,
        label: "S"
      };
      this.sourceData = {
        lat: undefined,
        lng: undefined,
        label: "S"
      };
      this.destString = this.sourceString.slice(0);
      this.sourceString = "";
      this.lat = sourceCopy.lat;
      this.lng = sourceCopy.lng;
    } else if (this.destData.lat) {
      this.source = JSON.parse(JSON.stringify(destCopy));
      this.sourceData = JSON.parse(JSON.stringify(destCopy));
      this.source.label = "S";
      this.sourceData.label = "S";
      this.destination = {
        lat: undefined,
        lng: undefined,
        label: "D"
      };
      this.destData = {
        lat: undefined,
        lng: undefined,
        label: "D"
      };
      this.sourceString = this.destString.slice(0);
      this.destString = "";
      this.lat = destCopy.lat;
      this.lng = destCopy.lng;
    }

    this.directionForm.setValue({
      source: this.sourceString,
      destination: this.destString
    });

    this.cdr.detectChanges();
  }

  addHome(pos: string) {
    this.directionForm.get(pos).setValue(this.currentUser.home.address);

    if (pos == "source") {
      this.sourceString = this.currentUser.home.address;
      this.source = {
        lat: this.currentUser.home.latitude,
        lng: this.currentUser.home.longitude,
        label: "S"
      };
      this.sourceData = {
        lat: this.currentUser.home.latitude,
        lng: this.currentUser.home.longitude,
        label: "S"
      };
      this.lat = this.source.lat;
      this.lng = this.source.lng;
    } else if (pos == "destination") {
      this.destString = this.currentUser.home.address;
      this.destination = {
        lat: this.currentUser.home.latitude,
        lng: this.currentUser.home.longitude,
        label: "D"
      };
      this.destData = {
        lat: this.currentUser.home.latitude,
        lng: this.currentUser.home.longitude,
        label: "D"
      };
      this.lat = this.destination.lat;
      this.lng = this.destination.lng;
    }
  }

  addWork(pos: string) {
    this.directionForm.get(pos).setValue(this.currentUser.work.address);
    console.log(this.currentUser.work);
    if (pos == "source") {
      this.sourceString = this.currentUser.work.address;
      this.source = {
        lat: this.currentUser.work.latitude,
        lng: this.currentUser.work.longitude,
        label: "S"
      };
      this.sourceData = {
        lat: this.currentUser.work.latitude,
        lng: this.currentUser.work.longitude,
        label: "S"
      };
      this.lat = this.source.lat;
      this.lng = this.source.lng;
    } else if (pos == "destination") {
      this.destString = this.currentUser.work.address;
      this.destination = {
        lat: this.currentUser.work.latitude,
        lng: this.currentUser.work.longitude,
        label: "D"
      };
      this.destData = {
        lat: this.currentUser.work.latitude,
        lng: this.currentUser.work.longitude,
        label: "D"
      };
      this.lat = this.destination.lat;
      this.lng = this.destination.lng;
    }
  }

  sourceAddressChange($event) {
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
    this.distance = $event.routes[0].legs[0].distance.text;
    this.eta = $event.routes[0].legs[0].duration.text;
    this.source = {
      lat: undefined,
      lng: undefined,
      label: "S"
    };
    this.destination = {
      lat: undefined,
      lng: undefined,
      label: "D"
    };
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
      if (this.zoom > 15) {
        this.tright = `${$event.na.l},${$event.ga.l}`;
        this.bleft = `${$event.na.j},${$event.ga.j}`;
        if (this.reportFilter) this.assignReportMarkersProto();
        // this.assignReportMarkers(this.tright, this.bleft);
        if (this.adFilter) this.assignAdMarkers(this.tright, this.bleft);
      }
    },
    100,
    false
  );

  mapZoomChange($event) {
    this.zoom = $event;
    if (this.zoom <= 15) {
      this.reportMarkers = [];
      this.adMarkers = [];
    }
  }

  addReportToMarkers(report) {
    this.reportMarkers.push({
      id: report.id,
      autoOpen: false,
      lat: report.position.y || report.latitude,
      lng: report.position.x || report.longitude,
      type: report.type,
      label: "R"
    });
  }

  private updateReportMarker(index: number) {
    var updateReportId = this.reportMarkers.slice(index, index + 1)[0].id;

    this.reportMarkers[index].autoOpen = true;
  }

  assignReportMarkersProto() {
    var wantedResults = [];
    var itemsProcessed = 0;
    this.filterList.forEach(type => {
      if (type.active) {
        this.reportService
          .getAllReportsByTypeBounds(type.apiName, this.tright, this.bleft)
          .subscribe(res => {
            res.reports.forEach(report => {
              wantedResults.push(report);
            });
            itemsProcessed++;
            // Done adding the last reports
            if (itemsProcessed === this.filterList.length) {
              this.updateReportList(wantedResults);
              this.cdr.detectChanges();
            }
          });
      } else {
        itemsProcessed++;
        if (itemsProcessed === this.filterList.length) {
          this.updateReportList(wantedResults);
          this.cdr.detectChanges();
        }
      }
    });
  }

  private assignReportMarkers(tright, bleft) {
    this.reportService.getAllReportsByBounds(tright, bleft).subscribe(res => {
      this.updateReportList(res.reports);
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
  autoOpen: boolean;
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
