import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { LivemapComponent } from "./livemap/livemap.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CookieService } from "ngx-cookie-service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { AgmCoreModule } from "@agm/core";
import { AgmDirectionModule } from "agm-direction";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

import { ReportMarkersComponent } from "./report-markers/report-markers.component";
import { AdMarkersComponent } from "./ad-markers/ad-markers.component";
import { ReportModalComponent } from "./report-modal/report-modal.component";
import { AdModalComponent } from "./ad-modal/ad-modal.component";
import { ReportInfoWindowComponent } from './report-info-window/report-info-window.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    LivemapComponent,
    UserDetailComponent,
    EditProfileComponent,
    ReportMarkersComponent,
    AdMarkersComponent,
    ReportModalComponent,
    AdModalComponent,
    ReportInfoWindowComponent
  ],
  imports: [
    GooglePlaceModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCvwX5W1Lv3Ozj5RYl06w3PbaBH8_8XSjA"
    }),
    AgmDirectionModule,
    FontAwesomeModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faThumbsUp);
  }
}
