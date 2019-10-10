import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { RouteHistoryService } from "../route-history.service";

@Component({
  selector: "app-route-history",
  templateUrl: "./route-history.component.html",
  styleUrls: ["./route-history.component.css"]
})
export class RouteHistoryComponent implements OnInit {
  currentUser;
  routeHistory;
  constructor(
    private routeHistoryService: RouteHistoryService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.routeHistory = [];
    if (this.cookieService.check("currentUser")) {
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
      this.getRouteHistory(this.currentUser.id);
    }
  }

  getRouteHistory(id) {
    let data = {
      userId: id
    };
    this.routeHistoryService.getRouteHistoryByUserId(data).subscribe(res => {
      res.history.forEach(route => {
        this.routeHistory.push(route);
      });
    });
  }

  deleteRouteHistory(id) {
    this.routeHistoryService.deleteRouteHistory(id).subscribe(res => {
      // find element w/ id and remove it
      for (let i = 0; i < this.routeHistory.length; i++) {
        if (this.routeHistory[i].id === id) {
          this.routeHistory.splice(i, 1);
          break;
        }
      }
    });
  }
}
