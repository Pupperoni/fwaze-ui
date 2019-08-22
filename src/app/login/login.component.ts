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
  ) {
    // Don't get logged in users log in again lol
    if (this.cookieService.get("currentUser")) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  get name() {
    return this.loginForm.get("name");
  }
  get password() {
    return this.loginForm.get("password");
  }

  onSubmit(userData) {
    // Process form here
    console.log("Login form submitted");
    if (userData.name == "" || userData.password == "") {
      // Can't have empty fields
      console.log("Empty field found");
      alert("Can't have empty fields");
    } else {
      // All looks good
      this.userService.loginUser(userData).subscribe(res => {
        if (this.cookieService.get("currentUser")) {
          this.cookieService.delete("currentUser");
        }
        res.user.home.latitude = parseFloat(res.user.home.latitude);
        res.user.home.longitude = parseFloat(res.user.home.longitude);
        res.user.work.latitude = parseFloat(res.user.work.latitude);
        res.user.work.longitude = parseFloat(res.user.work.longitude);

        this.cookieService.set("currentUser", JSON.stringify(res.user));
        this.router.navigate(["/"]);
      });
    }
  }
}
