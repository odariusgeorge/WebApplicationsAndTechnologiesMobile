import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private users: AuthData[] = [];
  private usersUpdated = new Subject<{users: AuthData[], usersCount: number}>();
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private userId: string;
  private isAdmin: boolean;
  private isVerified: boolean;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getIsVerified() {
    return this.isVerified;
  }

  getAllUsers() {
    this.http
    .get<{message: string, users: any, maxUsers: number}>(
      BACKEND_URL)
    .subscribe( response => {
      this.users = response.users;
      this.usersUpdated.next({users: [...this.users], usersCount: response.maxUsers})
    })
  }

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, admin: false, isVerified: true };
    this.http
      .post( BACKEND_URL + "/signup", authData)
      .subscribe(response => {
        this.login(authData.email, authData.password);
      }, error => {
        this.authStatusListener.next(false);
      }
      );

  }

  createModerator(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, admin: true, isVerified: false};
    this.http
      .post( BACKEND_URL + "/createModerator", authData)
      .subscribe(response => {
        this.router.navigate(["/postList"], {skipLocationChange: true});
        alert("Moderator created! \n" + "Email: " + email + "\nPassword: " + password);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  updatePassword(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, admin: true, isVerified: true};
    this.http
    .put( BACKEND_URL + "/modifyPassword/" + this.userId, authData)
    .subscribe(response => {
      this.isVerified = true;
      this.router.navigate(["/postList"], {skipLocationChange: true});
      alert("Password changed!");
    }, error => {
      this.logout();
    });

  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, admin: false, isVerified: false };
    this.http
      .post<{ token: string; expiresIn: number, userId: string, admin: boolean, isVerified: boolean}>(
        BACKEND_URL + "/login",
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.isAdmin = response.admin;
          this.isVerified = response.isVerified;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId, this.isAdmin, this.isVerified);
          if(this.isVerified) this.router.navigate(["/postList"], {skipLocationChange: true}); else
          this.router.navigate(["/modifyPassword"]);
        }
      }, _ => {
        this.authStatusListener.next(false);}
        );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      this.router.navigate(['/postList'], {skipLocationChange: true});
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.isAdmin = JSON.parse(authInformation.isAdmin);
      this.isVerified = JSON.parse(authInformation.isVerified);
      this.setAuthTimer(expiresIn / 1000);
      this.router.navigate(['/postList'], {skipLocationChange: true});
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isVerified = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/login"], {skipLocationChange: true});
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, isAdmin: boolean, isVerified: boolean) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("isAdmin", String(isAdmin));
    localStorage.setItem("isVerified", String(isVerified))

  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isVerified");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const isAdmin = localStorage.getItem("isAdmin");
    const isVerified = localStorage.getItem("isVerified");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      isAdmin: isAdmin,
      isVerified: isVerified
    }
  }

  getUserId() {
    return this.userId;
  }

  deleteUser(postId: string) {
    return this.http.delete(BACKEND_URL + "/" + postId)
  }

}
