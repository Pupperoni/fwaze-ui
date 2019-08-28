import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { LivemapComponent } from "./livemap/livemap.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
const routes: Routes = [
  { path: "", component: LivemapComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "edit", component: EditProfileComponent },
  { path: "detail/:id", component: UserDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
