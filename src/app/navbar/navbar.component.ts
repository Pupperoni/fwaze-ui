import { Component, OnInit, AfterViewChecked, OnDestroy } from "@angular/core";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, AfterViewChecked {
  currentUser: User = undefined;
  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    // console.log(this.currentUser);
  }

  ngAfterViewChecked() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    // console.log(this.currentUser);
  }

  onLogout() {
    this.cookieService.delete("currentUser");
    this.currentUser = undefined;
    console.log("Logged out");
  }
}
