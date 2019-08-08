import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Location } from "@angular/common";
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
    private location: Location,
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

  handleFileInput($event) {
    this.avatarUpload = $event.target.files[0];
  }

  onSubmit(formData) {
    formData.role = parseInt(formData.role);
    var uploadData = new FormData();

    uploadData.append("name", formData.name);
    uploadData.append("email", formData.email);
    uploadData.append("role", formData.role);
    uploadData.append("id", this.currentUser.id);
    if (this.avatarUpload)
      uploadData.append("avatar", this.avatarUpload, this.avatarUpload.name);

    this.userService.updateUser(uploadData).subscribe(res => {
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
