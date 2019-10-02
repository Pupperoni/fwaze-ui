import { Injectable } from "@angular/core";
declare let google: any;
@Injectable({
  providedIn: "root"
})
export class GoogleMapsService {
  constructor() {}

  getGeocoder() {
    return new google.maps.Geocoder();
  }

  getLatLng(latitude, longitude) {
    return new google.maps.LatLng(latitude, longitude);
  }
}
