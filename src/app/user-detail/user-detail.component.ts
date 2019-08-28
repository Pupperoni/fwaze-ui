import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from "../user.service";
import { CookieService } from "ngx-cookie-service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { User } from "../user";
import { Subscription } from "rxjs";

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
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) this.getUser();
    });
  }

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));

    // check if already advertised
    this.userService
      .getApplicationByUserId(this.currentUser.id)
      .subscribe(res => {
        if (!res.data) this.canApply = true;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

    this.userService
      .sendApplication(userData)
      .pipe(
        catchError(err => {
          alert(err.error.err);
          console.log(err);
          return throwError(err);
        })
      )
      .subscribe(res => {
        console.log("Your application is now being processed");
        alert("Your application is now being processed");
        this.canApply = false;
      });
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get("id");
    this.userService.getUser(id).subscribe(res => {
      this.user = res.user;
      this.userImage = `http://localhost:3000/users/${this.user.id}/image`;
      this.imageTimeStamp = new Date().getTime();
    });
  }
}
