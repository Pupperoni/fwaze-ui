import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
declare let google: any;
import { FormGroup, FormControl } from "@angular/forms";

import { MouseEvent } from "@agm/core";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";
import { ReportService } from "../report.service";
import { UserService } from "../user.service";
import { AdvertisementService } from "../advertisement.service";
import { CurrentMarkerService } from "../current-marker.service";

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
  geocoder = new google.maps.Geocoder();
  faveRoutes = [];
  selectedRoute: number = -1;
  reportFilter = true;
  adFilter = true;
  location = "";

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
    private userService: UserService,
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
      if (
        this.reportFilter &&
        this.filterList[data.type].active &&
        this.zoom > 15
      ) {
        this.reportMarkers.push({
          id: data.id,
          autoOpen: false,
          lat: data.latitude,
          lng: data.longitude,
          type: data.type
        });
      }
      this.currentMarkerService.setMarker(undefined);
      this.currentMarker = this.currentMarkerService.getMarker();
    });
    this.currentMarkerService.adSubmit$.subscribe(data => {
      this.adSubmit = data;
      if (this.adFilter && this.zoom > 15) {
        this.adMarkers.push({
          id: data.id,
          lat: data.latitude,
          lng: data.longitude
        });
      }
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

    if (this.currentUser) {
      this.userService.getfaveRoutes(this.currentUser.id).subscribe(res => {
        res.routes.forEach(route => {
          this.faveRoutes.push(route);
        });
      });
    }
  }

  onMapClick($event: MouseEvent) {
    this.currentMarkerService.setMarker({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
    this.currentMarker = this.currentMarkerService.getMarker();
    let latlng = new google.maps.LatLng(
      this.currentMarker.lat,
      this.currentMarker.lng
    );
    let request = {
      location: latlng
    };
    this.geocoder.geocode(request, res => {
      if (res != null) {
        this.currentMarkerService.setMarkerAddress(res[0].formatted_address);
        this.location = this.currentMarkerService.getMarkerAddress();
      }
    });
  }

  // Removes elements from reportMarkers not in wantedList and push new elements from wantedList
  updateReportList(wantedList) {
    let indexToBeDeleted = [];
    // Clean up current report list
    for (let i = 0; i < this.reportMarkers.length; i++) {
      let toDelete = true;
      for (let j = 0; j < wantedList.length; j++) {
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
      let toAdd = true;
      for (let i = 0; i < this.reportMarkers.length; i++) {
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
      this.assignAdMarkers();
    }
  }

  swap() {
    let sourceCopy = JSON.parse(JSON.stringify(this.sourceData));
    let destCopy = JSON.parse(JSON.stringify(this.destData));
    if (this.sourceData.lat && this.destData.lat) {
      this.source = JSON.parse(JSON.stringify(destCopy));
      this.sourceData = JSON.parse(JSON.stringify(destCopy));
      this.destination = JSON.parse(JSON.stringify(sourceCopy));
      this.destData = JSON.parse(JSON.stringify(sourceCopy));
      let bridge2 = this.sourceString.slice(0);
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

  setLocationNow() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location => {
        this.source = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          label: "S"
        };

        this.sourceData = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          label: "S"
        };
        let latlng = new google.maps.LatLng(
          location.coords.latitude,
          location.coords.longitude
        );
        let request = {
          location: latlng
        };
        this.geocoder.geocode(request, res => {
          if (res != null) this.sourceString = res[0].formatted_address;
          else this.sourceString = "Your current location";
          this.directionForm.setValue({
            source: this.sourceString,
            destination: this.destString
          });
        });
        this.lat = this.source.lat;
        this.lng = this.source.lng;
      });
    } else {
      alert("Geolocation not supported by your browser! :(");
    }
  }

  useRoute() {
    if (this.selectedRoute == -1) {
      // do nothing
    } else {
      // use em
      this.destination = {
        lat: this.faveRoutes[this.selectedRoute].destination_coords.y,
        lng: this.faveRoutes[this.selectedRoute].destination_coords.x,
        label: "D"
      };
      this.destData = {
        lat: this.faveRoutes[this.selectedRoute].destination_coords.y,
        lng: this.faveRoutes[this.selectedRoute].destination_coords.x,
        label: "D"
      };

      this.source = {
        lat: this.faveRoutes[this.selectedRoute].source_coords.y,
        lng: this.faveRoutes[this.selectedRoute].source_coords.x,
        label: "S"
      };
      this.sourceData = {
        lat: this.faveRoutes[this.selectedRoute].source_coords.y,
        lng: this.faveRoutes[this.selectedRoute].source_coords.x,
        label: "S"
      };

      this.destString = this.faveRoutes[this.selectedRoute].destination_string;
      this.sourceString = this.faveRoutes[this.selectedRoute].source_string;

      this.directionForm.setValue({
        source: this.sourceString,
        destination: this.destString
      });

      this.cdr.detectChanges();
    }
  }

  saveRoute() {
    if (this.sourceData.lat && this.destData.lat) {
      // create json of route details
      let routeData = {
        sourceLatitude: this.sourceData.lat,
        sourceLongitude: this.sourceData.lng,
        destinationLatitude: this.destData.lat,
        destinationLongitude: this.destData.lng,
        sourceString: this.sourceString,
        destinationString: this.destString,
        userId: this.currentUser.id
      };

      this.userService.addFaveRoute(routeData).subscribe(res => {
        alert("Route saved successfully");
        this.userService.getfaveRoutes(this.currentUser.id).subscribe(res => {
          this.faveRoutes = [];
          res.routes.forEach(route => {
            this.faveRoutes.push(route);
          });
        });
      });
    } else if (!this.currentUser) {
      alert("Please login");
    } else {
      alert("Please add both source and destination");
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
    for (let i = 0; i < $event.address_components.length; i++) {
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
    for (let i = 0; i < $event.address_components.length; i++) {
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
    let timeout;
    return function() {
      let context = this,
        args = arguments;
      let later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  mapPositionChange = this.debounce(
    function($event) {
      if (this.zoom > 15) {
        let NE = $event.getNorthEast();
        let SW = $event.getSouthWest();
        this.tright = `${NE.lat()},${NE.lng()}`;
        this.bleft = `${SW.lat()},${SW.lng()}`;
        if (this.reportFilter) this.assignReportMarkersProto();
        if (this.adFilter) this.assignAdMarkers();
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
    // let updateReportId = this.reportMarkers.slice(index, index + 1)[0].id;

    this.reportMarkers[index].autoOpen = true;
  }

  assignReportMarkersProto() {
    let wantedResults = [];
    let itemsProcessed = 0;
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
  private assignAdMarkers() {
    this.advertisementService
      .getAllAdsByBounds(this.tright, this.bleft)
      .subscribe(res => {
        // Clean up current ads list
        for (let i = 0; i < this.adMarkers.length; i++) {
          let toDelete = true;
          for (let j = 0; j < res.ads.length; j++) {
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
          let toAdd = true;
          for (let i = 0; i < this.adMarkers.length; i++) {
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
