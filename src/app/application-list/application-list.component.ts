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
  pendingIsActive = true;
  oldIsActive = false;
  currentUser;
  constructor(
    private applicationService: ApplicationService,
    private cookieService: CookieService
  ) {
    this.applicationService.getPendingApplications().subscribe(res => {
      res.data.forEach(application => {
        this.pendingApplications.push({
          userId: application.user_id,
          userName: application.user_name,
          timestamp: application.timestamp,
          status: application.status
        });
      });
    });
    this.applicationService.getAllApplications().subscribe(res => {
      res.data.forEach(application => {
        this.doneApplications.push({
          userId: application.user_id,
          userName: application.user_name,
          timestamp: application.timestamp,
          status: application.status
        });
      });
    });
  }

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
  }

  toggle(type: string) {
    if (type === "pending") {
      this.oldIsActive = false;
      this.pendingIsActive = true;
    }
    if (type === "old") {
      this.oldIsActive = true;
      this.pendingIsActive = false;
    }
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
