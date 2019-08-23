import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { User } from "../user";
import { catchError } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { throwError } from "rxjs";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"]
})
export class EditProfileComponent implements OnInit {
  currentUser: User = undefined;
  profileForm: FormGroup;

  avatarUpload = null;

  homeSubmit = false;
  workSubmit = false;
  home = {
    latitude: undefined,
    longitude: undefined,
    address: ""
  };

  work = {
    latitude: undefined,
    longitude: undefined,
    address: ""
  };

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

  handleFileInput($event) {
    if ($event.target.files.length > 0) {
      if (
        $event.target.files[0].type == "image/png" ||
        $event.target.files[0].type == "image/jpeg"
      )
        this.avatarUpload = $event.target.files[0];
      else {
        console.log("File uploaded is not an image");
        alert("File uploaded is not an image");
      }
    }
  }

  setHomeAddress($event) {
    this.home.address = "";
    this.home.latitude = $event.geometry.location.lat();
    this.home.longitude = $event.geometry.location.lng();
    for (let i = 0; i < $event.address_components.length; i++) {
      this.home.address = this.home.address.concat(
        $event.address_components[i].long_name
      );
      if (i != $event.address_components.length - 1)
        this.home.address = this.home.address.concat(", ");
    }
    this.homeSubmit = true;
  }

  setWorkAddress($event) {
    this.work.address = "";
    this.work.latitude = $event.geometry.location.lat();
    this.work.longitude = $event.geometry.location.lng();
    for (let i = 0; i < $event.address_components.length; i++) {
      this.work.address = this.work.address.concat(
        $event.address_components[i].long_name
      );
      if (i != $event.address_components.length - 1)
        this.work.address = this.work.address.concat(", ");
    }
    this.workSubmit = true;
  }

  onSubmit(formData) {
    formData.role = parseInt(formData.role);
    let uploadData = new FormData();

    uploadData.append("name", formData.name);
    uploadData.append("email", formData.email);
    uploadData.append("role", formData.role);
    uploadData.append("work", formData.work);
    uploadData.append("id", this.currentUser.id);

    if (this.avatarUpload)
      uploadData.append("avatar", this.avatarUpload, this.avatarUpload.name);

    this.userService
      .updateUser(uploadData)
      .pipe(
        catchError(err => {
          alert(err.error.err);
          console.log(err);
          return throwError(err);
        })
      )
      .subscribe(res => {
        let arr = [];
        let homeForm = {
          latitude: this.home.latitude,
          longitude: this.home.longitude,
          address: this.home.address,
          submit: this.homeSubmit,
          id: this.currentUser.id
        };
        this.userService.addHomeAd(homeForm).subscribe(res => {
          arr.push(res);
          if (arr.length == 2) {
            this.currentUser.name = formData.name;
            this.currentUser.email = formData.email;
            this.currentUser.role = formData.role;
            this.currentUser.home = this.homeSubmit
              ? this.home
              : this.currentUser.home;
            this.currentUser.work = this.workSubmit
              ? this.work
              : this.currentUser.work;
            this.cookieService.set(
              "currentUser",
              JSON.stringify(this.currentUser)
            );
            this.currentUser = JSON.parse(
              this.cookieService.get("currentUser")
            );
            this.router.navigate([`/detail/${this.currentUser.id}`]);
          }
        });
        let workForm = {
          latitude: this.work.latitude,
          longitude: this.work.longitude,
          address: this.work.address,
          submit: this.workSubmit,
          id: this.currentUser.id
        };
        this.userService.addWorkAd(workForm).subscribe(res => {
          arr.push(res);
          if (arr.length == 2) {
            this.currentUser.name = formData.name;
            this.currentUser.email = formData.email;
            this.currentUser.role = formData.role;
            this.currentUser.home = this.homeSubmit
              ? this.home
              : this.currentUser.home;
            this.currentUser.work = this.workSubmit
              ? this.work
              : this.currentUser.work;
            this.cookieService.set(
              "currentUser",
              JSON.stringify(this.currentUser)
            );
            this.currentUser = JSON.parse(
              this.cookieService.get("currentUser")
            );
            this.router.navigate([`/detail/${this.currentUser.id}`]);
          }
        });
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
