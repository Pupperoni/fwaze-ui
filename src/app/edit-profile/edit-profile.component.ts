import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { User } from "../user";
import { catchError } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { of } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { FormDataService } from "../form-data.service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"]
})
export class EditProfileComponent implements OnInit {
  currentUser: User = undefined;
  profileForm: FormGroup;
  invalidImage = false;

  avatarUpload = undefined;

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
    private router: Router,
    private toastr: ToastrService,
    private formDataService: FormDataService
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    this.setUser();
  }

  setUser() {
    this.profileForm = new FormGroup({
      name: new FormControl(this.currentUser.name, [Validators.required]),
      email: new FormControl(this.currentUser.email, [
        Validators.required,
        Validators.email
      ])
    });
  }

  handleFileInput($event) {
    if ($event.target.files.length > 0) {
      if (
        $event.target.files[0].type == "image/png" ||
        $event.target.files[0].type == "image/jpeg"
      ) {
        this.invalidImage = false;
        this.avatarUpload = $event.target.files[0];
      } else {
        this.invalidImage = true;
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

  validateEmail(email) {
    let re = /\S+@\S+/;
    return re.test(email);
  }

  onSubmit(formData) {
    if (!this.validateEmail(formData.email)) {
      this.toastr.error("Please enter a valid Email address", "Error", {
        timeOut: 5000
      });
    } else if (this.invalidImage) {
      this.toastr.error("Please upload a valid image file", "Error", {
        timeOut: 5000
      });
    } else {
      let uploadData = this.formDataService.createForm();

      uploadData.append("name", formData.name);
      uploadData.append("email", formData.email);
      uploadData.append("id", this.currentUser.id);
      uploadData.append("homeLatitude", this.home.latitude);
      uploadData.append("homeLongitude", this.home.longitude);
      uploadData.append("homeAddress", this.home.address);
      uploadData.append("workLatitude", this.work.latitude);
      uploadData.append("workLongitude", this.work.longitude);
      uploadData.append("workAddress", this.work.address);

      if (this.avatarUpload)
        uploadData.append("avatar", this.avatarUpload, this.avatarUpload.name);

      this.userService
        .updateUser(uploadData)
        .pipe(
          catchError(err => {
            this.toastr.error(err.error.err, "Error", { timeOut: 5000 });
            return of("error");
          })
        )
        .subscribe(res => {
          if (res !== "error") {
            this.currentUser.name = formData.name;
            this.currentUser.email = formData.email;
            this.currentUser.home = this.homeSubmit
              ? this.home
              : this.currentUser.home;
            this.currentUser.work = this.workSubmit
              ? this.work
              : this.currentUser.work;
            this.cookieService.delete("currentUser", "/");
            this.cookieService.set(
              "currentUser",
              JSON.stringify(this.currentUser),
              null,
              "/"
            );
            this.router.navigate([`/detail/${this.currentUser.id}`]);
          }
        });
    }
  }

  get name() {
    return this.profileForm.get("name");
  }
  get email() {
    return this.profileForm.get("email");
  }
}
