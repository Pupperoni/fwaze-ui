import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";

import { AdvertisementService } from "../advertisement.service";

@Component({
  selector: "app-ad-markers",
  templateUrl: "./ad-markers.component.html",
  styleUrls: ["./ad-markers.component.css"]
})
export class AdMarkersComponent implements OnInit, OnChanges {
  @Input() marker;
  constructor(private advertisementService: AdvertisementService) {}

  ngOnInit() {
    // this.assignAdMarkers();
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.assignAdMarkers();
  }

  //   // Retrieve all ads and display on the map
  //   private assignAdMarkers() {
  //     this.advertisementService.getAllAds().subscribe(res => {
  //       res.ads.forEach(ad => {
  //         this.ad_markers.push({
  //           lat: ad.position.y,
  //           lng: ad.position.x,
  //           user_id: ad.user_id,
  //           user_name: ad.name,
  //           caption: ad.caption,
  //           label: "A"
  //         });
  //       });
  //     });
  //   }
}

// interface adMarker {
//   lat: number;
//   lng: number;
//   caption: string;
//   user_id: number;
//   user_name: string;
//   label?: string;
// }
