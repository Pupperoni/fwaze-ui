import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { CookieService } from "ngx-cookie-service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  onSubmit(userData) {
    // Process form here
    console.log("Login form submitted");
    console.log(userData);
    if (userData.name == "" || userData.password == "") {
      // Can't have empty fields
      console.log("Empty field found");
    } else {
      // All looks good
      this.userService.loginUser(userData).subscribe(res => {
        console.log(res);
        this.cookieService.set("currentUser", JSON.stringify(res.user));
        this.router.navigate(["/"]);
      });
    }
  }
}
