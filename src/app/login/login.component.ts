import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { catchError } from "rxjs/operators";
import { throwError, of } from "rxjs";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
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
    private router: Router,
    private toastr: ToastrService
  ) {
    // Don't let logged in users log in again lol
    if (this.cookieService.check("currentUser")) {
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
    if (userData.name == "" || userData.password == "") {
      // Can't have empty fields
      this.toastr.error("Please include complete details", "Error", {
        timeOut: 5000
      });
    } else {
      // All looks good
      this.userService
        .loginUser(userData)
        .pipe(
          catchError(err => {
            this.toastr.error(err.error.err, "Error", {
              timeOut: 5000
            });
            return of("error");
            // return throwError(err);
          })
        )
        .subscribe(res => {
          if (res != "error") {
            this.userService.loginUserSocket(res.user);
            if (this.cookieService.check("currentUser")) {
              this.cookieService.delete("currentUser", "/");
            }
            res.user.home.latitude = parseFloat(res.user.home.latitude);
            res.user.home.longitude = parseFloat(res.user.home.longitude);
            res.user.work.latitude = parseFloat(res.user.work.latitude);
            res.user.work.longitude = parseFloat(res.user.work.longitude);

            this.cookieService.set(
              "currentUser",
              JSON.stringify(res.user),
              null,
              "/"
            );
            this.router.navigate(["/"]);
          }
        });
    }
  }
}
