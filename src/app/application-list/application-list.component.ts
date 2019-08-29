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
  pendingApplications = [];
  doneApplications = [];
  currentUser;
  constructor(
    private applicationService: ApplicationService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));

    this.applicationService.getPendingApplications().subscribe(res => {
      res.data.forEach(application => {
        if (application.status != 0) {
          this.doneApplications.push({
            userId: application.user_id,
            userName: application.user_name,
            timestamp: application.timestamp,
            status: application.status
          });
        } else {
          this.pendingApplications.push({
            userId: application.user_id,
            userName: application.user_name,
            timestamp: application.timestamp,
            status: application.status
          });
        }
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
        let applications = this.pendingApplications.splice(index, 1);
        applications[0].status = 1;
        this.doneApplications.push(applications[0]);
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
        let applications = this.pendingApplications.splice(index, 1);
        applications[0].status = -1;
        this.doneApplications.push(applications[0]);
      });
  }
}
