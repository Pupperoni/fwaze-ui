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

  getUser() {
    const id = +this.route.snapshot.paramMap.get("id");
    this.userService.getUser(id).subscribe(res => {
      this.user = res.user;
    });
  }
}
