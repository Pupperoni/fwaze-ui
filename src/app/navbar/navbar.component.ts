import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy
} from "@angular/core";

import { UserService } from "../user.service";
import { User } from "../user";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { EventService } from "../event.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, AfterViewChecked, OnDestroy {
  currentUser: User = undefined;
  applicationRejectedSub: Subscription;
  applicationAcceptedSub: Subscription;
  applicationCreatedSub: Subscription;
  currentUserSub: Subscription;
  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser")) {
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));

      // set up socket rooms of user
      this.userService.initUserRooms(this.currentUser);
    }

    this.applicationRejectedSub = this.eventService
      .getUserApplicationRejectedEventSubject()
      .subscribe(data => {
        this.toastr.error(
          "Sorry. Your application to become an advertiser was rejected!",
          "Application Rejected!",
          {
            timeOut: 5000
          }
        );
      });

    this.applicationAcceptedSub = this.eventService
      .getUserApplicationAcceptedEventSubject()
      .subscribe(data => {
        this.toastr.success(
          "Congrats! You've been accepted as a premium Advertiser!",
          "Application Accepted!",
          {
            timeOut: 5000
          }
        );
      });

    this.applicationCreatedSub = this.eventService
      .getUserApplicationCreatedEventSubject()
      .subscribe(data => {
        this.toastr.success(
          "A new application was posted.",
          "New Application",
          {
            timeOut: 5000
          }
        );
      });
  }

  ngAfterViewChecked() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.userService.loginUserSocket(this.currentUser);
    this.cookieService.delete("currentUser");
    this.currentUser = null;
    this.applicationAcceptedSub.unsubscribe();
    this.applicationRejectedSub.unsubscribe();
    this.applicationCreatedSub.unsubscribe();
  }

  goTo(id) {
    this.router.navigate([`/detail/${id}`]);
  }

  onLogout() {
    this.userService.loginUserSocket(this.currentUser);
    this.cookieService.delete("currentUser", "/");
    this.currentUser = null;
    this.cdr.detectChanges();
  }
}
