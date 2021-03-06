import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from "../user.service";
import { ApplicationService } from "../application.service";
import { CookieService } from "ngx-cookie-service";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";
import { User } from "../user";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { EventService } from "../event.service";
import { environment } from "../../environments/environment";
@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.css"]
})
export class UserDetailComponent implements OnInit, OnDestroy {
  user: User;
  imageTimeStamp = undefined;
  userImage = undefined;
  currentUser: User = undefined;
  subscription: Subscription;
  canApply = false;
  private currentUserSub: Subscription;
  private applicationRejectedSub: Subscription;
  private applicationAcceptedSub: Subscription;
  constructor(
    private userService: UserService,
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService,
    private eventService: EventService
  ) {
    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) this.getUser();
    });
  }

  ngOnInit() {
    if (this.cookieService.check("currentUser")) {
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    }

    this.applicationRejectedSub = this.eventService
      .getUserApplicationRejectedEventSubject()
      .subscribe(data => {
        if (data.userId === this.user.id) {
          this.canApply = true;
        }
      });

    this.applicationAcceptedSub = this.eventService
      .getUserApplicationAcceptedEventSubject()
      .subscribe(data => {
        if (data.userId === this.user.id) {
          this.user.role = 1;
        }
      });

    this.currentUserSub = this.eventService
      .getUserUpdatedEventSubject()
      .subscribe(data => {
        if (data.id === this.currentUser.id) {
          this.userService.getUser(data.id).subscribe(res => {
            this.cookieService.set(
              "currentUser",
              JSON.stringify(res.user),
              null,
              "/"
            );
            this.currentUser = JSON.parse(
              this.cookieService.get("currentUser")
            );
          });
        }
      });
    // check if already advertised
    this.applicationService
      .getApplicationByUserId(this.currentUser.id)
      .subscribe(res => {
        if (!res.data) this.canApply = true;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.currentUserSub.unsubscribe();
    this.applicationRejectedSub.unsubscribe();
    this.applicationAcceptedSub.unsubscribe();
  }

  getImagePath() {
    // For loading the image, check if the image link
    // is the newest one set in getUser
    if (this.imageTimeStamp) return this.userImage + "?" + this.imageTimeStamp;
    return this.userImage;
  }

  applyAdvertiser() {
    let dateNow = new Date();
    let userData = {
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      timestamp: `${dateNow.getFullYear()}-${dateNow.getMonth() +
        1}-${dateNow.getDate()} ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}.${dateNow.getMilliseconds()}`
    };

    this.applicationService
      .sendApplication(userData)
      .pipe(
        catchError(err => {
          this.toastr.error(err.error.err, "Error", {
            timeOut: 5000
          });
          return of([]);
        })
      )
      .subscribe(res => {
        // this.applicationService.sendApplicationSocket(res);
        this.toastr.success(
          "Your application is now being processed",
          "Application Submitted!",
          {
            timeOut: 5000
          }
        );
        this.canApply = false;
      });
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get("id");
    this.userService.getUser(id).subscribe(res => {
      this.user = res.user;
      this.userImage = `http://${environment.UMSAPIUrl.HOST}:${environment.UMSAPIUrl.PORT}/users/${this.user.id}/image`;
      this.imageTimeStamp = new Date().getTime();

      // update current user if there are any changes
      if (this.currentUser && this.currentUser.id === this.user.id) {
        if (this.user.home.address !== "") {
          // convert latlng to float
          this.user.home.latitude = parseFloat(this.user.home.latitude);
          this.user.home.longitude = parseFloat(this.user.home.longitude);
        }
        if (this.user.work.address !== "") {
          // convert latlng to float
          this.user.work.latitude = parseFloat(this.user.work.latitude);
          this.user.work.longitude = parseFloat(this.user.work.longitude);
        }
        this.cookieService.delete("currentUser", "/");
        this.cookieService.set(
          "currentUser",
          JSON.stringify(this.user),
          null,
          "/"
        );
        this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
      }
    });
  }
}
