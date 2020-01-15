import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tournament } from "../models/Tournament";
import { User } from "../models/User";
import { LoginForm } from '../models/loginForm.model';
import { JwtResponse } from '../models/jwtRespose.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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

  // login(username: String, password: String) {
  //   console.log("LOGIN SERVICE");
  //   const headers = new HttpHeaders({ "Content-Type": "application/json",  });

  //   console.log( this.LOGIN_URL + "?username=" + username + "&password="+password );
  //   return this.http.post<String>(
  //     "http://localhost:8080/login" + "?username=" + username + "&password="+password,
  //     { headers: headers }
  //   );
  // }

  // login(username: String, password: String): Observable<String> {
  //   let headers = new Headers({
  //     Authorization: "Basic " + btoa(username + ":" + password),
  //     "X-Requested-With": "XMLHttpRequest" // to suppress 401 browser popup
  //   });

  //   let config = {
  //     headers: new HttpHeaders()
  //       .append("X-Requested-With", "XMLHttpRequest")
  //       .append("Authorization", "Basic " + btoa(username + ":" + password))
  //   };

  //   let data = { username: username, password: password };

  //   return this.http.post<String>("http://localhost:8080/login", data, config);
  // }


  login(credentials: LoginForm): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.LOGIN_URL, credentials, httpOptions);
  }
}
