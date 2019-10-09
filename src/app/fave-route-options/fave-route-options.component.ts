import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  OnDestroy
} from "@angular/core";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "../user.service";

@Component({
  selector: "app-fave-route-options",
  templateUrl: "./fave-route-options.component.html",
  styleUrls: ["./fave-route-options.component.css"]
})
export class FaveRouteOptionsComponent implements OnInit, OnDestroy {
  @Input() sourceData;
  @Input() destData;
  @Input() sourceString;
  @Input() destString;

  @Output() routeUsed = new EventEmitter();

  // for checking if route used (have to update strings)
  private routeUsedSubscription: any;
  @Input() routeUsedEvent: Observable<any>;

  faveRoutes = [];
  selectedRoute: number = -1;
  routeName = "Select Routes";
  currentUser;
  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private toastr: ToastrService
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

    this.routeUsedSubscription = this.routeUsedEvent.subscribe(data => {
      // update data
      this.sourceData = data.source;
      this.destData = data.destination;
      this.sourceString = data.sourceString;
      this.destString = data.destString;
    });
  }

  ngOnDestroy() {
    this.routeUsedSubscription.unsubscribe();
  }

  useRoute(index) {
    this.selectedRoute = index;
    this.routeName = this.faveRoutes[index].name;
    if (index != -1) {
      const destination = {
        lat: this.faveRoutes[index].destination_coords.y,
        lng: this.faveRoutes[index].destination_coords.x
      };
      const source = {
        lat: this.faveRoutes[index].source_coords.y,
        lng: this.faveRoutes[index].source_coords.x
      };
      this.sourceString = this.faveRoutes[index].source_string;
      this.destString = this.faveRoutes[index].destination_string;

      this.routeUsed.emit({
        source: source,
        destination: destination,
        sourceString: this.sourceString,
        destString: this.destString
      });
    }
  }

  saveRoute($event) {
    // if ($event.label == "My Fave Route")
    //   $event.label = `My Fave Route (${this.faveRoutes.length + 1})`;
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
        let newRoute = {
          id: res.data.routeId,
          name: res.data.routeName,
          destination_coords: {
            x: res.data.destinationLongitude,
            y: res.data.destinationLatitude
          },
          source_coords: {
            x: res.data.sourceLongitude,
            y: res.data.sourceLatitude
          },
          destination_string: res.data.destinationString,
          source_string: res.data.sourceString
        };
        this.faveRoutes.push(newRoute);
      });
    } else if (!this.currentUser) {
      this.toastr.error("Please login", "Error", { timeOut: 5000 });
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
        this.toastr.success("Route has been successfully deleted", res.msg, {
          timeOut: 5000
        });
        this.faveRoutes.splice(this.selectedRoute, 1);
        this.selectedRoute = -1;
        this.routeName = "Select Routes";
      });
    } else if (!this.currentUser) {
      this.toastr.error("Please login", "Error", { timeOut: 5000 });
    }
  }
}
