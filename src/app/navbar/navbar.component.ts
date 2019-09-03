import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy
} from "@angular/core";
import { ApplicationsSocket } from "../sockets";
import { User } from "../user";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, AfterViewChecked, OnDestroy {
  currentUser: User = undefined;
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private socket: ApplicationsSocket
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));

    this.socket.on("applicationRejected", data => {
      if (this.currentUser.id === data.data.userId) {
        this.toastr.error(
          "Sorry. Your application to become an advertiser was rejected!",
          "Application Rejected!",
          {
            timeOut: 5000
          }
        );
      }
    });

    this.socket.on("applicationAccepted", data => {
      if (this.currentUser.id === data.data.userId) {
        this.toastr.success(
          "Congrats! You've been accepted as a premium Advertiser!",
          "Application Accepted!",
          {
            timeOut: 5000
          }
        );
      }
    });

    this.socket.on("applicationCreated", data => {
      if (this.currentUser.role === 2) {
        this.toastr.success(
          "A new application was posted.",
          "New Application",
          {
            timeOut: 5000
          }
        );
      }
    });
  }

  ngAfterViewChecked() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.cookieService.delete("currentUser");
    this.currentUser = undefined;
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
