import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy
} from "@angular/core";
import { User } from "../user";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, AfterViewChecked, OnDestroy {
  currentUser: User = undefined;
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
  }

  ngAfterViewChecked() {
    if (this.cookieService.check("currentUser"))
      this.currentUser = JSON.parse(this.cookieService.get("currentUser"));
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.cookieService.delete("currentUser");
    this.currentUser = undefined;
  }

  goTo(id) {
    this.router.navigate([`/detail/${id}`]);
  }

  onLogout() {
    this.cookieService.delete("currentUser");
    this.currentUser = null;
    this.cdr.detectChanges();

    // this.router.navigate(["/"]);
    // this.router.navigateByUrl("/");
  }
}
