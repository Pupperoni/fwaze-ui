import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { CookieService } from "ngx-cookie-service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
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
    private router: Router
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
    console.log("Register form submitted");
    console.log("Automatically setting role: Regular(0)");
    userData.role = 0;
    if (
      userData.name == "" ||
      userData.email == "" ||
      userData.password == "" ||
      userData.confirmPassword == ""
    ) {
      // Can't have empty fields
      console.log("Empty field found");
      alert("Can't have empty fields");
    } else if (userData.password != userData.confirmPassword) {
      // Check password and confirmPassword; must match
      console.log("Passwords don't match");
      alert("Passwords don't match");
    } else if (!this.validateEmail(userData.email)) {
      // Check if email is valid
      console.log("Format is not a valid email address.");
      alert("Format is not a valid email address.");
    } else {
      // All looks good
      this.userService
        .registerUser(userData)
        .pipe(
          catchError(err => {
            alert(err.error.err);
            console.log(err.error.err);
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
