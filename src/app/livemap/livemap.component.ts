import { Component, OnInit } from "@angular/core";
import { MouseEvent } from "@agm/core";

@Component({
  selector: "app-livemap",
  templateUrl: "./livemap.component.html",
  styleUrls: ["./livemap.component.css"]
})
export class LivemapComponent implements OnInit {
  lat: number = 14.5409;
  lng: number = 121.0503;
  zoom: number = 16;

  markers: marker[] = [];

  constructor() {}

  ngOnInit() {}

  onMapClick($event: MouseEvent) {
    console.log("map clicked");
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  onMarkerClick(index: number) {
    console.log("marker deleted");
    this.markers.splice(index, 1);
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
