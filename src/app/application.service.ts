import { Injectable } from "@angular/core";
import { EventsSocket } from "./sockets";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "./../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ApplicationService {
  private url = `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/users/apply`;
  constructor(private http: HttpClient, private socket: EventsSocket) {}

  applicationRejected = this.socket.fromEvent<any>("applicationRejected");
  applicationAccepted = this.socket.fromEvent<any>("applicationAccepted");
  applicationCreated = this.socket.fromEvent<any>("applicationSent");

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  sendApplication(userData): Observable<any> {
    return this.http.post<any>(`${this.url}/new`, userData, this.httpOptions);
  }

  getApplicationByUserId(userId): Observable<any> {
    return this.http.get<any>(`${this.url}/${userId}`);
  }

  getPendingApplications(): Observable<any> {
    return this.http.get<any>(`${this.url}/pending`);
  }

  getAllApplications(): Observable<any> {
    return this.http.get<any>(`${this.url}`);
  }

  approveApplication(data): Observable<any> {
    return this.http.put<any>(`${this.url}/approve`, data, this.httpOptions);
  }

  rejectApplication(data): Observable<any> {
    return this.http.put<any>(`${this.url}/reject`, data, this.httpOptions);
  }

  sendApplicationSocket(data) {
    this.socket.emit("applicationCreated", data);
  }

  approveApplicationSocket(data) {
    this.socket.emit("onAccepted", data);
  }

  rejectApplicationSocket(data) {
    this.socket.emit("onRejected", data);
  }
}
