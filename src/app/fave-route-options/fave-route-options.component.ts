import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  ChangeDetectorRef
} from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "../user.service";

@Component({
  selector: "app-fave-route-options",
  templateUrl: "./fave-route-options.component.html",
  styleUrls: ["./fave-route-options.component.css"]
})
export class FaveRouteOptionsComponent implements OnInit {
  @Input() sourceData;
  @Input() destData;
  @Input() sourceString;
  @Input() destString;

  @Output() routeUsed = new EventEmitter();

  faveRoutes = [];
  selectedRoute: number = -1;
  currentUser;
  constructor(
    private cookieService: CookieService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    else this.currentUser = undefined;

    if (this.currentUser) {
      this.userService.getfaveRoutes(this.currentUser.id).subscribe(res => {
        res.routes.forEach(route => {
          this.faveRoutes.push(route);
        });
      });
    }
  }

  useRoute() {
    if (this.selectedRoute != -1) {
      const destination = {
        lat: this.faveRoutes[this.selectedRoute].destination_coords.y,
        lng: this.faveRoutes[this.selectedRoute].destination_coords.x
      };
      const source = {
        lat: this.faveRoutes[this.selectedRoute].source_coords.y,
        lng: this.faveRoutes[this.selectedRoute].source_coords.x
      };
      this.sourceString = this.faveRoutes[this.selectedRoute].source_string;
      this.destString = this.faveRoutes[this.selectedRoute].destination_string;

      this.routeUsed.emit({
        source: source,
        destination: destination,
        sourceString: this.sourceString,
        destString: this.destString
      });
    }
  }

  saveRoute($event) {
    if (this.sourceData.lat && this.destData.lat) {
      // create json of route details
      let routeData = {
        sourceLatitude: this.sourceData.lat,
        sourceLongitude: this.sourceData.lng,
        destinationLatitude: this.destData.lat,
        destinationLongitude: this.destData.lng,
        sourceString: this.sourceString,
        destinationString: this.destString,
        routeName: $event.label,
        userId: this.currentUser.id
      };

      this.userService.addFaveRoute(routeData).subscribe(res => {
        alert("Route saved successfully");
        this.userService.getfaveRoutes(this.currentUser.id).subscribe(res => {
          this.faveRoutes = [];
          res.routes.forEach(route => {
            this.faveRoutes.push(route);
          });
        });
      });
    } else if (!this.currentUser) {
      alert("Please login");
    } else {
      alert("Please add both source and destination");
    }
  }

  deleteRoute() {
    if (this.selectedRoute != -1) {
      // create json of route details
      let routeData = {
        userId: this.currentUser.id,
        routeId: this.faveRoutes[this.selectedRoute].id
      };

      this.userService.deleteFaveRoute(routeData).subscribe(res => {
        alert("Route has been deleted");
        this.faveRoutes.splice(this.selectedRoute, 1);
        this.selectedRoute = -1;
      });
    } else if (!this.currentUser) {
      alert("Please login");
    } else {
      alert("Select a saved route");
    }
  }
}
