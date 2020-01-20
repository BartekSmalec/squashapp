import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tournament } from "../models/Tournament";
import { User } from "../models/User";
import { LoginForm } from "../models/loginForm.model";
import { JwtResponse } from "../models/jwtRespose.model";
import { TokenStorageService } from "./token-storage.service";
import { Match } from "../models/Match";
import { Comment } from "../models/Comment";
import { MatchSet } from "../models/MatchSet";

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
  private GET_MATCHES_URL = `${this.BASE_URL}match/add`;
  private ADD_COMMENT_URL = `${this.BASE_URL}comment/addComment`;
  private ADD_SET_URL = `${this.BASE_URL}matchSet/add`;
  private GET_SETS_URL = `${this.BASE_URL}matchSet/getMatchSet`;
  private GET_SET_MATCHID_URL = `${this.BASE_URL}matchSet/getMatchSets`;
  private ADD_PARTICIPANT_URL = `${this.BASE_URL}tournament/addParticipant`;
  private GET_MY_TOURNAMENTS_URL = `${this.BASE_URL}tournament/getTournamentForPrincipal`;








  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getCurrentUser(): Observable<String> {
    return this.http.get(this.CURRENT_USER_URL, { responseType: "text" });
  }

  addComment(comment: Comment, id: number): Observable<MatchSet> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.post<MatchSet>(
      this.ADD_COMMENT_URL + "?id=" + id,
      comment,
      header
    );
  }


  addParticipant(id: number): Observable<MatchSet> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.post<MatchSet>(
      this.ADD_PARTICIPANT_URL + "?id=" + id,
      header
    );
  }

  getMyTournaments(): Observable<Tournament[]>
  {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.get<Tournament[]>(this.GET_MY_TOURNAMENTS_URL, header);
  }

  addMatchSet(
    matchSet: MatchSet,
    id: number,
    userName: string
  ): Observable<Comment> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.post<Comment>(
      this.ADD_SET_URL + "?matchId=" + id + "&userName=" + userName,
      matchSet,
      header
    );
  }

  getMatchSet(): Observable<MatchSet[]> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.get<MatchSet[]>(this.GET_SETS_URL, header);
  }

  getMatchSetId(id: number): Observable<MatchSet[]> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.get<MatchSet[]>(this.GET_SETS_URL + "/"+ id, header);
  }


  getMatchSetsMatchId(id: number): Observable<MatchSet[]> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.get<MatchSet[]>(this.GET_SET_MATCHID_URL  + "/"+ id, header);
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

  addMatch(
    match: Match,
    tournamentId: number,
    firstPersonName: string,
    secondPersonName: string
  ): Observable<Match> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };

    return this.http.post<Match>(
      this.GET_MATCHES_URL +
        "?tournamentId=" +
        tournamentId +
        "&firstPersonName=" +
        firstPersonName +
        "&secondPersonName=" +
        secondPersonName,
      match,
      header
    );
  }

  getTournament(id: number): Observable<Tournament> {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.tokenStorageService.getToken()}`
      )
    };
    return this.http.get<Tournament>(
      this.GET_TOURNAMENTS_URL + "/" + id,
      header
    );
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
