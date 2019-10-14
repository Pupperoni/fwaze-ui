import { Injectable } from "@angular/core";
import { EventsSocket } from "./sockets";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "./../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class RouteHistoryService {
  private url = `http://${environment.UMSAPIUrl.HOST}:${environment.UMSAPIUrl.PORT}/users`;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient, private socket: EventsSocket) {}

  getRouteHistoryByUserId(data): Observable<any> {
    return this.http.get<any>(`${this.url}/history/${data.userId}`);
  }

  addRouteHistory(data): Observable<any> {
    return this.http.post(`${this.url}/history/new`, data, this.httpOptions);
  }

  deleteRouteHistory(data): Observable<any> {
    return this.http.post(`${this.url}/history/delete`, data, this.httpOptions);
  }
}
