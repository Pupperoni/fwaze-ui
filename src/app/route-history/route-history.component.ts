import { Component, OnInit, OnDestroy } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { RouteHistoryService } from "../route-history.service";
import { ToastrService } from "ngx-toastr";
import { EventService } from "../event.service";
import { Subscription } from "rxjs";
import { WindowService } from "../window.service";

const delay = 2500;
@Component({
  selector: "app-route-history",
  templateUrl: "./route-history.component.html",
  styleUrls: ["./route-history.component.css"]
})
export class RouteHistoryComponent implements OnInit, OnDestroy {
  currentUser;
  routeHistory;
  userRouteHistoryCreatedSubscription: Subscription;
  constructor(
    private routeHistoryService: RouteHistoryService,
    private cookieService: CookieService,
    private eventService: EventService,
    private toastr: ToastrService,
    private windowService: WindowService
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser")) {
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
      // setTimeout(() => {
      this.getRouteHistory(this.currentUser.id);
      // }, delay);
    }

    this.userRouteHistoryCreatedSubscription = this.eventService
      .getUserRouteHistoryCreatedEventSubject()
      .subscribe(route => {
        this.toastr
          .success(
            "You just searched for a new route! Click here to refresh.",
            "New route used"
          )
          .onTap.subscribe(() => this.toastrClickedHandler());
      });
  }

  ngOnDestroy() {
    this.userRouteHistoryCreatedSubscription.unsubscribe();
  }

  toastrClickedHandler() {
    this.windowService.reload();
  }

  getRouteHistory(id) {
    let data = {
      userId: id
    };
    this.routeHistoryService.getRouteHistoryByUserId(data).subscribe(res => {
      this.routeHistory = res.history;
    });
  }

  deleteRouteHistory(id) {
    let data = {
      id: id,
      userId: this.currentUser.id
    };
    this.routeHistoryService.deleteRouteHistory(data).subscribe(res => {
      // find element w/ id and remove it
      for (let i = 0; i < this.routeHistory.length; i++) {
        if (this.routeHistory[i].id === id) {
          this.routeHistory[i].removed = true;
          break;
        }
      }
    });
  }

  transitionEnd($event, index) {
    this.routeHistory.splice(index, 1);
  }
}
