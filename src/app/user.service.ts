import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "./../environments/environment";
import { Observable } from "rxjs";

import { User } from "./user";

interface UserResponse {
  users: User[];
}

@Injectable({
  providedIn: "root"
})
export class UserService {
  private url = `http://${environment.APIUrl.HOST}:${
    environment.APIUrl.PORT
  }/users`;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient) {}

  // HTTP methods here

  getUsers(): Observable<UserResponse> {
    console.log(this.url);
    return this.http.get<UserResponse>(this.url);
  }

  registerUser(userData): Observable<any> {
    console.log(`Submit POST request to ${this.url}`);
    return this.http.post(`${this.url}/new`, userData, this.httpOptions);
  }
}
