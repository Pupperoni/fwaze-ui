import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { CookieService } from "ngx-cookie-service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService
  ) {
    if (this.cookieService.check("currentUser")) {
      this.router.navigate(["/"]);
    }

    this.registerForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      confirmPassword: new FormControl("", [Validators.required])
    });
  }

  ngOnInit() {}

  validateEmail(email) {
    let re = /\S+@\S+/;
    return re.test(email);
  }

  onSubmit(userData) {
    // Process form here
    userData.role = 0;
    if (
      userData.name == "" ||
      userData.email == "" ||
      userData.password == "" ||
      userData.confirmPassword == ""
    ) {
      // Can't have empty fields
      this.toastr.error("Please include complete details", "Error", {
        timeOut: 5000
      });
    } else if (userData.password != userData.confirmPassword) {
      // Check password and confirmPassword; must match
      this.toastr.error("Passwords don't match", "Error", {
        timeOut: 5000
      });
    } else if (!this.validateEmail(userData.email)) {
      // Check if email is valid
      this.toastr.error("Please enter a valid Email address", "Error", {
        timeOut: 5000
      });
    } else {
      // All looks good
      this.userService
        .registerUser(userData)
        .pipe(
          catchError(err => {
            this.toastr.error(err.error.err, "Error", {
              timeOut: 5000
            });
            return throwError(err);
          })
        )
        .subscribe(() => {
          this.router.navigate(["/login"]);
        });
    }
  }

  get name() {
    return this.registerForm.get("name");
  }
  get email() {
    return this.registerForm.get("email");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
  }
}
