import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { LivemapComponent } from "./livemap/livemap.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";

import { AgmCoreModule } from "@agm/core";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { Config } from "../../config";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    LivemapComponent,
    UserDetailComponent,
    EditProfileComponent
  ],
  imports: [
    GooglePlaceModule,
    BrowserModule,
    AppRoutingModule,
    // AgmCoreModule.forRoot({ apiKey: "AIzaSyApVP0g5iCgHHbwoUIdJa4YfZ9WPM6QyE0" })
    AgmCoreModule.forRoot({ apiKey: "AIzaSyCvwX5W1Lv3Ozj5RYl06w3PbaBH8_8XSjA" })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
