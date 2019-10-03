import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, Observable, Subscription } from "rxjs";
import { MouseEvent } from "@agm/core";
import { User } from "../user";
import { UserService } from "../user.service";
import { CookieService } from "ngx-cookie-service";
import { ReportService } from "../report.service";
import { AdvertisementService } from "../advertisement.service";
import { CurrentMarkerService } from "../current-marker.service";
import { EventService } from "../event.service";
import { GoogleMapsService } from "../google-maps.service";

@Component({
  selector: "app-livemap",
  templateUrl: "./livemap.component.html",
  styleUrls: ["./livemap.component.css"]
})
export class LivemapComponent implements OnInit, OnDestroy {
  selectedRoute;
  currentUser: User = undefined;
  tright = undefined;
  bleft = undefined;
  distance = undefined;
  eta = undefined;
  geocoder;
  reportFilter = true;
  adFilter = true;
  location = "";
  transitOptions: string = "DRIVING";
  private routeUsedSubject: Subject<any> = new Subject<any>();
  reports: Observable<any[]>;

  adCreatedSubscription: Subscription;
  reportCreatedSubscription: Subscription;
  currentUserSubscription: Subscription;

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
    private userService: UserService,
    private advertisementService: AdvertisementService,
    private eventService: EventService,
    private googleMapsService: GoogleMapsService
  ) {
    this.geocoder = this.googleMapsService.getGeocoder();
  }

  ngOnDestroy() {
    // leave map room
    this.reportService.exitMap();
    this.adCreatedSubscription.unsubscribe();
    this.reportCreatedSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }

  private isInside(report) {
    let right = this.tright.split(",")[1];
    let left = this.bleft.split(",")[1];
    let top = this.tright.split(",")[0];
    let bottom = this.bleft.split(",")[0];

    if (
      report.latitude > bottom &&
      report.latitude < top &&
      report.longitude > left &&
      report.longitude < right
    )
      return true;
    return false;
  }

  ngOnInit() {
    // join map room
    this.reportService.visitMap();

    this.reportCreatedSubscription = this.eventService
      .getReportCreatedEvents()
      .subscribe(report => {
        if (this.isInside(report)) {
          if (
            this.reportFilter &&
            this.filterList[report.type].active &&
            this.zoom > 15
          ) {
            this.reportMarkers.push({
              id: report.id,
              autoOpen: false,
              lat: report.latitude,
              lng: report.longitude,
              type: report.type
            });
          }
        }
      });

    this.adCreatedSubscription = this.eventService
      .getAdCreatedEvents()
      .subscribe(ad => {
        if (this.adFilter && this.zoom > 15) {
          this.adMarkers.push({
            id: ad.id,
            lat: ad.latitude,
            lng: ad.longitude
          });
        }
      });

    this.currentUserSubscription = this.eventService
      .getUserUpdatedEventSubject()
      .subscribe(data => {
        if (this.currentUser && data.id === this.currentUser.id) {
          this.userService.getUser(data.id).subscribe(res => {
            this.cookieService.set(
              "currentUser",
              JSON.stringify(res.user),
              null,
              "/"
            );
            this.currentUser = JSON.parse(
              this.cookieService.get("currentUser")
            );
          });
        }
      });

    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;
  }

  updateChildren() {
    // source and dest string updated here so we send this data to route form
    let data = {
      source: this.sourceData,
      destination: this.destData,
      sourceString: this.sourceString,
      destString: this.destString
    };

    this.routeUsedSubject.next(data);
  }

  isActive(mode: string) {
    return this.transitOptions === mode;
  }

  onMapClick($event: MouseEvent) {
    this.currentMarkerService.setMarker({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
    this.currentMarker = this.currentMarkerService.getMarker();
    let latlng = this.googleMapsService.getLatLng(
      this.currentMarker.lat,
      this.currentMarker.lng
    );
    let request = {
      location: latlng
    };
    this.geocoder.geocode(request, res => {
      if (res != null) {
        this.currentMarkerService.setMarkerLocation(res[0].formatted_address);
        this.location = this.currentMarkerService.getMarkerLocation();
      }
    });
  }

  onReportSubmit($event) {
    // this.reportService.addReportSocket($event);
    this.currentMarkerService.setMarker(undefined);
    this.currentMarker = this.currentMarkerService.getMarker();
  }

  onAdSubmit($event) {
    // this.advertisementService.addAdSocket($event);
    this.currentMarkerService.setMarker(undefined);
    this.currentMarker = this.currentMarkerService.getMarker();
  }

  onUpVote($event) {
    // this.reportService.addVoteSocket($event.data);
  }

  onDownVote($event) {
    // this.reportService.deleteVoteSocket($event.data);
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
      this.assignReportMarkers();
    }

    if (!this.adFilter) {
      this.adMarkers = [];
    } else {
      this.assignAdMarkers();
    }
  }

  changeTravel(mode: string) {
    this.transitOptions = mode;
  }

  swap($event) {
    if ($event.source.lat && $event.destination.lat) {
      this.source = JSON.parse(JSON.stringify($event.source));
      this.sourceData = JSON.parse(JSON.stringify($event.source));
      this.destination = JSON.parse(JSON.stringify($event.destination));
      this.destData = JSON.parse(JSON.stringify($event.destination));
      this.source.label = "S";
      this.sourceData.label = "S";
      this.destination.label = "D";
      this.destData.label = "D";
      this.sourceString = $event.sourceString;
      this.destString = $event.destString;
    } else if ($event.destination.lat) {
      this.destination = JSON.parse(JSON.stringify($event.destination));
      this.destData = JSON.parse(JSON.stringify($event.destination));
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
      this.destString = $event.destString;
      this.sourceString = "";
      this.lat = $event.destination.lat;
      this.lng = $event.destination.lng;
    } else if ($event.source.lat) {
      this.source = JSON.parse(JSON.stringify($event.source));
      this.sourceData = JSON.parse(JSON.stringify($event.source));
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
      this.sourceString = $event.sourceString;
      this.destString = "";
      this.lat = $event.source.lat;
      this.lng = $event.source.lng;
    }

    this.updateChildren();
  }

  addHome($event) {
    if ($event.pos == "source") {
      this.sourceString = $event.home.address;
      this.source = {
        lat: $event.home.latitude,
        lng: $event.home.longitude,
        label: "S"
      };
      this.sourceData = {
        lat: $event.home.latitude,
        lng: $event.home.longitude,
        label: "S"
      };
      this.lat = this.source.lat;
      this.lng = this.source.lng;
    } else if ($event.pos == "destination") {
      this.destString = $event.home.address;
      this.destination = {
        lat: $event.home.latitude,
        lng: $event.home.longitude,
        label: "D"
      };
      this.destData = {
        lat: $event.home.latitude,
        lng: $event.home.longitude,
        label: "D"
      };
      this.lat = this.destination.lat;
      this.lng = this.destination.lng;
    }
    this.updateChildren();
  }

  addWork($event) {
    if ($event.pos == "source") {
      this.sourceString = $event.work.address;
      this.source = {
        lat: $event.work.latitude,
        lng: $event.work.longitude,
        label: "S"
      };
      this.sourceData = {
        lat: $event.work.latitude,
        lng: $event.work.longitude,
        label: "S"
      };
      this.lat = this.source.lat;
      this.lng = this.source.lng;
    } else if ($event.pos == "destination") {
      this.destString = $event.work.address;
      this.destination = {
        lat: $event.work.latitude,
        lng: $event.work.longitude,
        label: "D"
      };
      this.destData = {
        lat: $event.work.latitude,
        lng: $event.work.longitude,
        label: "D"
      };
      this.lat = this.destination.lat;
      this.lng = this.destination.lng;
    }
    this.updateChildren();
  }

  setLocationNow($event) {
    this.source = {
      lat: $event.source.lat,
      lng: $event.source.lng,
      label: $event.source.label
    };
    this.sourceData = {
      lat: $event.source.lat,
      lng: $event.source.lng,
      label: $event.source.label
    };
    this.sourceString = $event.sourceString;
    this.lat = $event.source.lat;
    this.lng = $event.source.lng;

    this.updateChildren();
  }

  onRouteUsed($event) {
    // use em
    if ($event.source.lat && $event.destination.lng) {
      this.destination = {
        lat: $event.destination.lat,
        lng: $event.destination.lng,
        label: "D"
      };
      this.destData = {
        lat: $event.destination.lat,
        lng: $event.destination.lng,
        label: "D"
      };

      this.source = {
        lat: $event.source.lat,
        lng: $event.source.lng,
        label: "S"
      };
      this.sourceData = {
        lat: $event.source.lat,
        lng: $event.source.lng,
        label: "S"
      };

      this.destString = $event.destString;
      this.sourceString = $event.sourceString;

      this.updateChildren();
    }
  }

  sourceAddressChange($event) {
    this.source = {
      lat: $event.source.lat,
      lng: $event.source.lng,
      label: "S"
    };
    this.sourceData = {
      lat: $event.source.lat,
      lng: $event.source.lng,
      label: "S"
    };
    this.sourceString = $event.sourceString;

    this.lat = this.source.lat;
    this.lng = this.source.lng;
    this.updateChildren();
  }

  destinationAddressChange($event) {
    this.destination = {
      lat: $event.destination.lat,
      lng: $event.destination.lng,
      label: $event.destination.label
    };
    this.destData = {
      lat: $event.destination.lat,
      lng: $event.destination.lng,
      label: $event.destination.label
    };
    this.destString = $event.destString;

    this.lat = this.destination.lat;
    this.lng = this.destination.lng;
    this.updateChildren();
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
        if (this.reportFilter) this.assignReportMarkers();
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

  private assignReportMarkers() {
    let wantedResults = [];
    let itemsProcessed = 0;
    this.filterList.forEach(type => {
      if (type.active) {
        this.reportService
          .getAllReportsByTypeBounds(type.apiName, this.tright, this.bleft)
          .subscribe(res => {
            if (res) {
              res.reports.forEach(report => {
                wantedResults.push(report);
              });
              itemsProcessed++;
              // Done adding the last reports
              if (itemsProcessed === this.filterList.length) {
                this.updateReportList(wantedResults);
              }
            }
          });
      } else {
        itemsProcessed++;
        if (itemsProcessed === this.filterList.length) {
          this.updateReportList(wantedResults);
        }
      }
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
