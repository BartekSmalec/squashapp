import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CurrentUserComponent } from "./components/current-user/current-user.component";
import { LoginComponentComponent } from "./components/login-component/login-component.component";
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponentComponent
  },
  {
    path: "register",
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
