import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: "",
      email: "",
      password: "",
      confirm_password: ""
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

  // getAll() {
  //   this.userService.getUsers().subscribe(res => {
  //     this.users = res.users;
  //   });
  // }
}
