import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tournament } from "../models/Tournament";
import { User } from "../models/User";
import { LoginForm } from "../models/loginForm.model";
import { JwtResponse } from "../models/jwtRespose.model";
import { TokenStorageService } from "./token-storage.service";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class AppServiceService {
  private BASE_URL = "http://localhost:8080/";
  private LOGIN_URL = `${this.BASE_URL}login`;
  private LOGOUT_URL = `${this.BASE_URL}logout`;

  private CURRENT_USER_URL = `${this.BASE_URL}currentUser`;
  private REGISTER_URL = `${this.BASE_URL}users/register`;
  private ADD_TOURNAMENT_URL = `${this.BASE_URL}tournament/add`;
  private GET_TOURNAMENTS_URL = `${this.BASE_URL}tournament/getTournament`;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getCurrentUser(): Observable<String> {
    return this.http.get(this.CURRENT_USER_URL, { responseType: "text" });
  }

  getTournamentTest(): Observable<Tournament> {
    console.log("TEST");

    console.log(
      "TOKEN: " + JSON.stringify(this.tokenStorageService.getToken())
    );

    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };

    console.log("HEADER: " + JSON.stringify(header));

    return this.http.get<Tournament>(
      "http://localhost:8080/tournament/getTournament/11/",
      header
    );
  }

  getTournaments(): Observable<Tournament[]> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.get<Tournament[]>(this.GET_TOURNAMENTS_URL, header);
  }

  registerUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    return this.http.post<User>(this.REGISTER_URL, user, { headers: headers });
  }

  login(credentials: LoginForm): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(
      this.LOGIN_URL,
      credentials,
      httpOptions
    );
  }

  addTournament(tournament: Tournament): Observable<Tournament> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.post<Tournament>(
      this.ADD_TOURNAMENT_URL,
      tournament,
      header
    );
  }
}
