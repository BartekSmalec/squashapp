import { Injectable } from '@angular/core';
 
const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';
const ROLE_TEACHER = 'ROLE_TEACHER';
const ROLE_ADMIN = 'ROLE_ADMIN';
const ROLE_USER = 'ROLE_USER';
 
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private roles: Array<string> = [];
  constructor() { }
 
  signOut() {
    window.localStorage.clear();
  }
 
  public saveToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }
 
  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }
 
  public saveUsername(username: string) {
    window.localStorage.removeItem(USERNAME_KEY);
    window.localStorage.setItem(USERNAME_KEY, username);
  }
 
  public getUsername(): string {
    return localStorage.getItem(USERNAME_KEY);
  }
 
  public saveAuthorities(authorities: string[]) {
    window.localStorage.removeItem(AUTHORITIES_KEY);
    window.localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }
 
  public getAuthorities(): string[] {
    this.roles = [];
 
    if (localStorage.getItem(TOKEN_KEY)) {
      JSON.parse(localStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority.authority);
      });
    }
 
    return this.roles;
  }

  public isTeacher(): boolean {
    if(this.roles.includes(ROLE_TEACHER)) {
      return true;
    } else {
      return false;
    }
  }

  public isAdmin(): boolean {
    if(this.roles.includes(ROLE_ADMIN)) {
      return true;
    } else {
      return false;
    }
  }

  public isUser(): boolean {
    if(this.roles.includes(ROLE_USER)) {
      return true;
    } else {
      return false;
    }
  }
}