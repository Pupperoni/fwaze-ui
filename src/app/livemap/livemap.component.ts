import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-livemap",
  templateUrl: "./livemap.component.html",
  styleUrls: ["./livemap.component.css"]
})
export class LivemapComponent implements OnInit {
  lat: number = 14.5409;
  lng: number = 121.0503;

  constructor() {}

  ngOnInit() {}
}
