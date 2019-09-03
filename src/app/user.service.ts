import { Injectable } from "@angular/core";
import { ApplicationsSocket } from "./sockets";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UsersSocket } from "./sockets";
import { environment } from "./../environments/environment";
import { Observable } from "rxjs";

import { User } from "./user";

interface MiscResponse {
  msg: string;
  user: User;
}

interface UserArrayResponse {
  users: User[];
}

interface UserResponse {
  user: User;
}

@Injectable({
  providedIn: "root"
})
export class UserService {
  currentUserChanged = this.socket.fromEvent<any>("applicationSent");

  private url = `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/users`;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  imageOptions = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
  };

  constructor(
    private http: HttpClient,
    private socket: ApplicationsSocket,
    private userSocket: UsersSocket
  ) {}

  // HTTP methods here

  getAllUsers(): Observable<UserArrayResponse> {
    // console.log(`Submit GET request to ${this.url}`);
    return this.http.get<UserArrayResponse>(this.url);
  }

  registerUser(userData): Observable<any> {
    // console.log(`Submit POST request to ${this.url}/new`);
    return this.http.post(`${this.url}/new`, userData, this.httpOptions);
  }

  loginUser(userData): Observable<any> {
    // console.log(`Submit POST request to ${this.url}/login`);
    return this.http.post(`${this.url}/login`, userData, this.httpOptions);
  }

  getUser(id: string): Observable<UserResponse> {
    // console.log(`Submit GET request to ${this.url}/${id}`);
    return this.http.get<UserResponse>(`${this.url}/${id}`);
  }

  getImage(id: string): Observable<any> {
    // console.log(`Submit GET request to ${this.url}/${id}/image`);
    return this.http.get<any>(`${this.url}/${id}/image`);
  }

  updateUser(userData): Observable<any> {
    // console.log(`Submit PUT request to ${this.url}/edit`);
    return this.http.put(`${this.url}/edit`, userData);
  }

  addHomeAd(userData): Observable<any> {
    // console.log(`Submit PUT request to ${this.url}/home`);
    return this.http.put(`${this.url}/home`, userData);
  }

  addWorkAd(userData): Observable<any> {
    // console.log(`Submit PUT request to ${this.url}/work`);
    return this.http.put(`${this.url}/work`, userData);
  }

  addFaveRoute(routeData): Observable<any> {
    return this.http.post<any>(
      `${this.url}/faves/new`,
      routeData,
      this.httpOptions
    );
  }

  deleteFaveRoute(routeData): Observable<any> {
    return this.http.post<any>(
      `${this.url}/faves/delete`,
      routeData,
      this.httpOptions
    );
  }

  getfaveRoutes(userId): Observable<any> {
    return this.http.get<any>(`${this.url}/faves/${userId}`);
  }

  loginUserSocket(data) {
    this.userSocket.emit("login", data);
  }
}
