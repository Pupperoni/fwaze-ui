import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { UserService } from "../user.service";
import { CookieService } from "ngx-cookie-service";

import { User } from "../user";

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.css"]
})
export class UserDetailComponent implements OnInit {
  @Input() user: User;
  imageTimeStamp = undefined;
  userImage = undefined;
  currentUser: User = undefined;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    this.getUser();
  }

  getImagePath() {
    // For loading the image, check if the image link
    // is the newest one set in getUser
    if (this.imageTimeStamp) return this.userImage + "?" + this.imageTimeStamp;
    return this.userImage;
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get("id");
    this.userService.getUser(id).subscribe(res => {
      this.user = res.user;
      console.log(this.user);
      this.userImage = `http://localhost:3000/users/${this.user.id}/image`;
      this.imageTimeStamp = new Date().getTime();
    });
  }
}
