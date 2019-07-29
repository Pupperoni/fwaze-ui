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
import { EditProfileComponent } from './edit-profile/edit-profile.component';

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
    BrowserModule,
    AppRoutingModule
    // AgmCoreModule.forRoot({ apiKey: "AIzaSyDcEjHVZ-li9kWsbpJ7StClaNBxvlk3WOs" })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
