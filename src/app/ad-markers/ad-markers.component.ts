import { Component, OnInit, Input } from "@angular/core";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";
import { AdvertisementService } from "../advertisement.service";
@Component({
  selector: "app-ad-markers",
  templateUrl: "./ad-markers.component.html",
  styleUrls: ["./ad-markers.component.css"]
})
export class AdMarkersComponent implements OnInit {
  @Input() marker;
  @Input() index;
  icon = undefined;

  markerInfo = undefined;
  currentUser: User = undefined;
  constructor(
    private cookieService: CookieService,
    private advertisementService: AdvertisementService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));

    this.icon = {
      url: "../../assets/ad.png",
      scaledSize: {
        width: 30,
        height: 30
      }
    };
  }

  toggleInfoWindow(id: string) {
    console.log(id);
    this.advertisementService.getAdById(id).subscribe((res: any) => {
      console.log(res);
      this.markerInfo = res.ad;
    });
  }
}
