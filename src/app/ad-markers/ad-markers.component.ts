import { Component, OnInit, Input } from "@angular/core";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";
@Component({
  selector: "app-ad-markers",
  templateUrl: "./ad-markers.component.html",
  styleUrls: ["./ad-markers.component.css"]
})
export class AdMarkersComponent implements OnInit {
  @Input() marker;
  currentUser: User = undefined;
  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
  }
}
