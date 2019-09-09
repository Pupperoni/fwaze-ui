import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApplicationService } from "../application.service";
import { CookieService } from "ngx-cookie-service";
import { catchError } from "rxjs/operators";
import { throwError, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-application-list",
  templateUrl: "./application-list.component.html",
  styleUrls: ["./application-list.component.css"]
})
export class ApplicationListComponent implements OnInit, OnDestroy {
  pendingApplications = [];
  doneApplications = [];
  pendingIsActive = true;
  oldIsActive = false;
  currentUser;
  applicationCreatedSub: Subscription;
  constructor(
    private applicationService: ApplicationService,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {
    this.applicationService.getPendingApplications().subscribe(res => {
      res.data.forEach(application => {
        this.pendingApplications.push({
          id: application.id,
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
          id: application.id,
          userId: application.user_id,
          userName: application.user_name,
          timestamp: application.timestamp,
          status: application.status
        });
      });
    });
  }

  ngOnInit() {
    this.applicationCreatedSub = this.applicationService.applicationCreated.subscribe(
      application => {
        this.pendingApplications.push({
          id: application.id,
          userId: application.userId,
          userName: application.userName,
          timestamp: application.timestamp,
          status: 0
        });
      }
    );

    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
  }

  ngOnDestroy() {
    this.applicationCreatedSub.unsubscribe();
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
      id: this.pendingApplications[index].id,
      adminId: this.currentUser.id,
      userId: id
    };

    this.applicationService
      .approveApplication(data)
      .pipe(
        catchError(err => {
          this.toastr.error(err.error.err, "Error", { timeOut: 5000 });
          return throwError(err);
        })
      )
      .subscribe(res => {
        // this.applicationService.approveApplicationSocket(res);
        let applications = this.pendingApplications.splice(index, 1);
        applications[0].status = 1;
        this.doneApplications.unshift(applications[0]);
      });
  }

  reject(id, index) {
    const data = {
      id: this.pendingApplications[index].id,
      adminId: this.currentUser.id,
      userId: id
    };
    this.applicationService
      .rejectApplication(data)
      .pipe(
        catchError(err => {
          this.toastr.error(err.error.err, "Error", { timeOut: 5000 });
          return throwError(err);
        })
      )
      .subscribe(res => {
        // this.applicationService.rejectApplicationSocket(res);
        let applications = this.pendingApplications.splice(index, 1);
        applications[0].status = -1;
        this.doneApplications.unshift(applications[0]);
      });
  }
}
