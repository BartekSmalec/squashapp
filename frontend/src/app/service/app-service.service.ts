import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tournament } from "../models/Tournament";
import { User } from "../models/User";

@Injectable({
  providedIn: "root"
})
export class AppServiceService {
  private BASE_URL = "http://localhost:8080/";
  private LOGIN_URL = `${this.BASE_URL}login`;
  private LOGOUT_URL = `${this.BASE_URL}logout`;

  private CURRENT_USER_URL = `${this.BASE_URL}currentUser`;
  private REGISTER_URL = `${this.BASE_URL}users/register`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<String> {
    return this.http.get(this.CURRENT_USER_URL, { responseType: "text" });
  }

  getTournamentTest(): Observable<Tournament> {
    console.log("TEST");
    return this.http.get<Tournament>(
      "http://localhost:8080/tournament/getTournament/11"
    );
  }

  registerUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post<User>(this.REGISTER_URL, user, { headers: headers });
  }

  login(username: String, password: String) {
    console.log("LOGIN SERVICE");
    const headers = new HttpHeaders({ "Content-Type": "application/json",  });

    console.log( this.LOGIN_URL + "?username=" + username + "&password="+password );
    return this.http.post<String>(
      "http://localhost:8080/login" + "?username=" + username + "&password="+password,
      { headers: headers }
    );
  }
}
