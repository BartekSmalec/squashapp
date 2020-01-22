import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CurrentUserComponent } from "./components/current-user/current-user.component";
import { LoginComponentComponent } from "./components/login-component/login-component.component";
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AddTournamentComponent } from './components/add-tournament/add-tournament.component';
import { TournamentListComponent } from './components/tournament-list/tournament-list.component';
import { AddMatchComponent } from './components/add-match/add-match.component';
import { AddSetComponent } from './components/add-set/add-set.component';
import { MyTournamentsComponent } from './components/my-tournaments/my-tournaments.component';
import { EditTournamentComponent } from './components/edit-tournament/edit-tournament.component';
import { UserComponent } from './components/user/user.component';
import { TournamentComponent } from './components/tournament/tournament.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponentComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "addTournament",
    component: AddTournamentComponent
  },
  {
    path: "tournamentList",
    component: TournamentListComponent
  },
  {
    path: "addMatch/:id",
    component: AddMatchComponent
  },
  {
    path: "addSet/:id/:tournamentId",
    component: AddSetComponent
  },
  {
    path: "myTournaments",
    component: MyTournamentsComponent
  },
  {
    path: "editTournament/:id",
    component: EditTournamentComponent
  },
  {
    path: "user/:userName",
    component: UserComponent,
  },
  {
    path: "tournament/:id",
    component: TournamentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
