import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import localeFil from "@angular/common/locales/fil";
import { SocketIoModule } from "ngx-socket-io";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { LivemapComponent } from "./livemap/livemap.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EventsSocket } from "./sockets";
import { Secret } from "./config";
import { CookieService } from "ngx-cookie-service";
import {
  FontAwesomeModule,
  FaIconLibrary
} from "@fortawesome/angular-fontawesome";
import {
  fas,
  faThumbsUp,
  faExchangeAlt,
  faComment,
  faLocationArrow,
  faHeart,
  faArrowRight,
  faHome,
  faBriefcase,
  faWalking,
  faCar,
  faTrain,
  faEnvelope,
  faUserTag,
  faTimes,
  faFilter,
  faMapMarkerAlt,
  faThumbtack,
  faCaretDown,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import { AgmCoreModule } from "@agm/core";
import { AgmDirectionModule } from "agm-direction";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ReportMarkersComponent } from "./report-markers/report-markers.component";
import { AdMarkersComponent } from "./ad-markers/ad-markers.component";
import { ReportModalComponent } from "./report-modal/report-modal.component";
import { AdModalComponent } from "./ad-modal/ad-modal.component";
import { CommentComponent } from "./comment/comment.component";
import { FilterModalComponent } from "./filter-modal/filter-modal.component";
import { ApplicationListComponent } from "./application-list/application-list.component";
import { FaveRouteOptionsComponent } from "./fave-route-options/fave-route-options.component";
import { SaveRouteModalComponent } from "./save-route-modal/save-route-modal.component";
import { RouteFormComponent } from "./route-form/route-form.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { RouteHistoryComponent } from "./route-history/route-history.component";

registerLocaleData(localeFil);

// const config: SocketIoConfig = {
//   url: `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}`,
//   options: {}
// };

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
    CommentComponent,
    FilterModalComponent,
    ApplicationListComponent,
    FaveRouteOptionsComponent,
    SaveRouteModalComponent,
    RouteFormComponent,
    RouteHistoryComponent
  ],
  imports: [
    GooglePlaceModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: Secret.apiKey
    }),
    SocketIoModule,
    NgxPaginationModule,
    AgmDirectionModule,
    FontAwesomeModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [CookieService, EventsSocket],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faThumbsUp);
    library.addIcons(faExchangeAlt);
    library.addIcons(faComment);
    library.addIcons(faLocationArrow);
    library.addIcons(faHeart);
    library.addIcons(faArrowRight);
    library.addIcons(faHome);
    library.addIcons(faBriefcase);
    library.addIcons(faWalking);
    library.addIcons(faCar);
    library.addIcons(faTrain);
    library.addIcons(faEnvelope);
    library.addIcons(faUserTag);
    library.addIcons(faTimes);
    library.addIcons(faFilter);
    library.addIcons(faMapMarkerAlt);
    library.addIcons(faThumbtack);
    library.addIcons(faCaretDown);
    library.addIcons(faEllipsisV);
  }
}
