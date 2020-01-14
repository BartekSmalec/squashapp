import {Injectable, RootRenderer} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Tournament } from '../models/Tournament';
import { User } from '../models/User';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private BASE_URL = 'http://localhost:8080/';
    private LOGIN_URL = `${this.BASE_URL}/login`;
    private LOGOUT_URL = `${this.BASE_URL}/logout`;
    
    private CURRENT_USER_URL = `${this.BASE_URL}/users/currentUser`;
    private REGISTER_URL = `${this.BASE_URL}/users/register`;
   

    constructor(private http: HttpClient) {
    }

    getCurrentUser(): Observable<User> {
		return this.http.get<User>(this.CURRENT_USER_URL);
    }
    
    getTournamentTest(): Observable<Tournament>
    {
        console.log("getTournamentTest(): lol");
        return this.http.get<Tournament>('http://localhost:8080/tournament/getTournament/11');
    }

    registerUser(user: User): Observable<User> {
		const headers = new HttpHeaders({ "Content-Type": "application/json" });
		return this.http.post<User>(
			this.REGISTER_URL,
			user,
			{ headers: headers }
		);
    }
    
    login(username: String, password: String)
    {
        const headers = new HttpHeaders({ "Content-Type": "application/json" });
		return this.http.post<String>(
			this.LOGIN_URL+"?username="+username+"&password=password",
			{ headers: headers }
		);
    }


}


