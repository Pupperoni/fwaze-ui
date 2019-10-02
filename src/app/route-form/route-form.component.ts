import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnDestroy
} from "@angular/core";
import { Observable } from "rxjs";

import { User } from "../user";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl } from "@angular/forms";
import { GoogleMapsService } from "../google-maps.service";
import { NavigatorService } from "../navigator.service";

@Component({
  selector: "app-route-form",
  templateUrl: "./route-form.component.html",
  styleUrls: ["./route-form.component.css"]
})
export class RouteFormComponent implements OnInit, OnDestroy {
  @Input() sourceData;
  @Input() destData;
  @Input() sourceString;
  @Input() destString;

  // for checking if route used (have to update strings)
  private routeUsedSubscription: any;
  @Input() routeUsedEvent: Observable<any>;

  @Output() onHomeClick = new EventEmitter();
  @Output() onWorkClick = new EventEmitter();
  @Output() onSwapClick = new EventEmitter();
  @Output() onCurrentLocationClick = new EventEmitter();
  @Output() onSourceChange = new EventEmitter();
  @Output() onDestinationChange = new EventEmitter();

  currentUser: User = undefined;
  geocoder;
  directionForm: FormGroup = undefined;

  constructor(
    private cookieService: CookieService,
    private toastr: ToastrService,
    private googleMapsService: GoogleMapsService,
    private navigatorService: NavigatorService
  ) {
    this.geocoder = this.googleMapsService.getGeocoder();
  }

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    this.directionForm = new FormGroup({
      source: new FormControl(""),
      destination: new FormControl("")
    });
    this.routeUsedSubscription = this.routeUsedEvent.subscribe(data => {
      // update data
      this.sourceData = data.source;
      this.destData = data.destination;
      this.sourceString = data.sourceString;
      this.destString = data.destString;

      // update form value
      this.directionForm.setValue({
        source: this.sourceString,
        destination: this.destString
      });
    });
  }

  ngOnDestroy() {
    this.routeUsedSubscription.unsubscribe();
  }

  sourceAddressChange($event) {
    let sourceData = {
      lat: $event.geometry.location.lat(),
      lng: $event.geometry.location.lng(),
      label: "S"
    };
    let sourceString = "";
    for (let i = 0; i < $event.address_components.length; i++) {
      sourceString = sourceString.concat(
        $event.address_components[i].long_name
      );
      if (i != $event.address_components.length - 1)
        sourceString = sourceString.concat(", ");
    }
    this.onSourceChange.emit({
      source: sourceData,
      sourceString: sourceString
    });
  }

  destinationAddressChange($event) {
    let destData = {
      lat: $event.geometry.location.lat(),
      lng: $event.geometry.location.lng(),
      label: "D"
    };
    let destString = "";
    for (let i = 0; i < $event.address_components.length; i++) {
      destString = destString.concat($event.address_components[i].long_name);
      if (i != $event.address_components.length - 1)
        destString = destString.concat(", ");
    }
    this.onDestinationChange.emit({
      destination: destData,
      destString: destString
    });
  }

  homeButtonClicked(pos: string) {
    this.onHomeClick.emit({
      home: this.currentUser.home,
      pos: pos
    });
  }

  workButtonClicked(pos: string) {
    this.onWorkClick.emit({
      work: this.currentUser.work,
      pos: pos
    });
  }

  swapButtonClicked() {
    this.onSwapClick.emit({
      source: this.destData,
      destination: this.sourceData,
      sourceString: this.destString,
      destString: this.sourceString
    });
  }

  currentLocationButtonClicked() {
    let navigator = this.navigatorService.getNavigator();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location => {
        let sourceData = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          label: "S"
        };

        let latlng = this.googleMapsService.getLatLng(
          location.coords.latitude,
          location.coords.longitude
        );
        let request = {
          location: latlng
        };
        this.geocoder.geocode(request, res => {
          let sourceString = "Your current location";
          if (res != null) sourceString = res[0].formatted_address;

          this.onCurrentLocationClick.emit({
            source: sourceData,
            sourceString: sourceString
          });
        });
      });
    } else {
      this.toastr.error(
        "Geolocation not supported by your browser. Considering updating your browser.",
        "Error",
        {
          timeOut: 5000
        }
      );
    }
  }
}
