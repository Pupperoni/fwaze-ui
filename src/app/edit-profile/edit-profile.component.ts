import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { User } from "../user";

import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"]
})
export class EditProfileComponent implements OnInit {
  currentUser: User = undefined;
  profileForm: FormGroup;

  avatarUpload = null;
  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    this.setUser();
  }

  setUser() {
    this.profileForm = new FormGroup({
      name: new FormControl(this.currentUser.name, [Validators.required]),
      email: new FormControl(this.currentUser.email, [
        Validators.required,
        Validators.email
      ]),
      role: new FormControl(this.currentUser.role.toString(), [
        Validators.required
      ])
    });
  }

  handleFileInput(files: FileList) {
    this.avatarUpload = files.item(0);
    console.log(this.avatarUpload);
  }

  onSubmit(formData) {
    formData.role = parseInt(formData.role);
    formData.id = this.currentUser.id;

    formData.avatar = this.avatarUpload;
    console.log(formData);

    this.userService.updateUser(formData).subscribe(res => {
      console.log(res);
      this.cookieService.delete("currentUser");
      this.cookieService.set("currentUser", JSON.stringify(formData));
      this.router.navigate([`/detail/${this.currentUser.id}`]);
    });
  }

  get name() {
    return this.profileForm.get("name");
  }
  get email() {
    return this.profileForm.get("email");
  }
  get role() {
    return this.profileForm.get("role");
  }
}
