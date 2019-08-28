import { Component, OnInit } from "@angular/core";
import { ApplicationService } from "../application.service";
import { CookieService } from "ngx-cookie-service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Component({
  selector: "app-application-list",
  templateUrl: "./application-list.component.html",
  styleUrls: ["./application-list.component.css"]
})
export class ApplicationListComponent implements OnInit {
  applications = [];
  currentUser;
  constructor(
    private applicationService: ApplicationService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (this.cookieService.get("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));

    this.applicationService.getPendingApplications().subscribe(res => {
      res.data.forEach(application => {
        this.applications.push({
          userId: application.user_id,
          userName: application.user_name,
          timestamp: application.timestamp,
          status: application.status
        });
      });
    });
  }

  approve(id, index) {
    const data = {
      adminId: this.currentUser.id,
      userId: id
    };
    this.applicationService
      .approveApplication(data)
      .pipe(
        catchError(err => {
          alert(err.error.err);
          console.log(err);
          return throwError(err);
        })
      )
      .subscribe(res => {
        console.log(res);
        this.applications.splice(index, 1);
      });
  }

  reject(id, index) {
    const data = {
      adminId: this.currentUser.id,
      userId: id
    };
    this.applicationService
      .rejectApplication(data)
      .pipe(
        catchError(err => {
          alert(err.error.err);
          console.log(err);
          return throwError(err);
        })
      )
      .subscribe(res => {
        console.log(res);
        this.applications.splice(index, 1);
      });
  }
}
