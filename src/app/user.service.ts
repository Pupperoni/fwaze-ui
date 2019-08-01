import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "./../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

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
  private url = `http://${environment.APIUrl.HOST}:${
    environment.APIUrl.PORT
  }/users`;
  public currentUser: Observable<User>;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient) {}

  // HTTP methods here

  getAllUsers(): Observable<UserArrayResponse> {
    console.log(`Submit GET request to ${this.url}`);
    return this.http.get<UserArrayResponse>(this.url);
  }

  registerUser(userData): Observable<any> {
    console.log(`Submit POST request to ${this.url}/new`);
    return this.http.post(`${this.url}/new`, userData, this.httpOptions);
  }

  loginUser(userData): Observable<any> {
    console.log(`Submit POST request to ${this.url}/login`);
    return this.http.post(`${this.url}/login`, userData, this.httpOptions);
  }

  getUser(id: number): Observable<UserResponse> {
    console.log(`Submit GET request to ${this.url}/${id}`);
    return this.http.get<UserResponse>(`${this.url}/${id}`);
  }

  updateUser(userData): Observable<any> {
    console.log(`Submit PUT request to ${this.url}/${userData.id}`);
    return this.http.put(`${this.url}/edit`, userData, this.httpOptions);
  }
}
