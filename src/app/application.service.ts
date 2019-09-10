import { Injectable } from "@angular/core";
import { EventsSocket } from "./sockets";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CONSTANTS } from "../../constants";
import { environment } from "./../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ApplicationService {
  private url = `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/users/apply`;
  constructor(private http: HttpClient, private socket: EventsSocket) {}

  applicationRejected = this.socket.fromEvent<any>(
    CONSTANTS.EVENTS.APPLICATION_REJECTED
  );
  applicationAccepted = this.socket.fromEvent<any>(
    CONSTANTS.EVENTS.APPLICATION_APPROVED
  );
  applicationCreated = this.socket.fromEvent<any>(
    CONSTANTS.EVENTS.APPLICATION_CREATED
  );

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
}
