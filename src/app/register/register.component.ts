import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private userService: UserService, private router: Router) {
    this.registerForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      confirm_password: new FormControl("", [Validators.required])
    });
  }

  ngOnInit() {}

  onSubmit(userData) {
    // Process form here
    console.log("Register form submitted");
    console.log("Automatically setting role: Regular(0)");
    userData.role = 0;
    console.log(userData);
    if (
      userData.name == "" ||
      userData.email == "" ||
      userData.password == "" ||
      userData.confirm_password == ""
    ) {
      // Can't have empty fields
      console.log("Empty field found");
    } else if (userData.password != userData.confirm_password) {
      // Check password and confirm_password; must match
      console.log("Passwords don't match");
    } else {
      // All looks good
      this.userService.registerUser(userData).subscribe(res => {
        console.log(res);
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
  get confirm_password() {
    return this.registerForm.get("confirm_password");
  }
}
