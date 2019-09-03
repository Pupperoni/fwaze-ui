import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy
} from "@angular/core";
import { ApplicationService } from "../application.service";
import { UserService } from "../user.service";
import { User } from "../user";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
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
    private applicationService: ApplicationService
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));

    this.applicationRejectedSub = this.applicationService.applicationRejected.subscribe(
      data => {
        if (this.currentUser.id === data.data.userId) {
          this.toastr.error(
            "Sorry. Your application to become an advertiser was rejected!",
            "Application Rejected!",
            {
              timeOut: 5000
            }
          );
        }
      }
    );

    this.applicationAcceptedSub = this.applicationService.applicationAccepted.subscribe(
      data => {
        if (this.currentUser.id === data.data.userId) {
          this.toastr.success(
            "Congrats! You've been accepted as a premium Advertiser!",
            "Application Accepted!",
            {
              timeOut: 5000
            }
          );
        }
      }
    );

    this.applicationCreatedSub = this.applicationService.applicationCreated.subscribe(
      data => {
        if (this.currentUser.role === 2) {
          this.toastr.success(
            "A new application was posted.",
            "New Application",
            {
              timeOut: 5000
            }
          );
        }
      }
    );

    // this.currentUserSub = this.userService.currentUserChanged.subscribe(
    //   data => {
    //     this.userService.getUser(data.data.userId).subscribe(res => {
    //       this.cookieService.set(
    //         "currentUser",
    //         JSON.stringify(res.user),
    //         null,
    //         "/"
    //       );
    //       this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    //     });
    //   }
    // );
  }

  ngAfterViewChecked() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.cookieService.delete("currentUser");
    this.currentUser = undefined;
    this.applicationAcceptedSub.unsubscribe();
    this.applicationRejectedSub.unsubscribe();
    this.applicationCreatedSub.unsubscribe();
  }

  goTo(id) {
    this.router.navigate([`/detail/${id}`]);
  }

  onLogout() {
    this.cookieService.delete("currentUser", "/");
    this.currentUser = null;
    this.cdr.detectChanges();
  }
}
