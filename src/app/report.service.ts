import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Report } from "./report";
import { environment } from "./../environments/environment";

interface ReportResponse {
  report: Report;
}

interface ReportArrayResponse {
  reports: Report[];
}

@Injectable({
  providedIn: "root"
})
export class ReportService {
  private url = `http://${environment.APIUrl.HOST}:${
    environment.APIUrl.PORT
  }/map/reports`;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient) {}

  getAllReports(): Observable<ReportArrayResponse> {
    console.log(`Sending GET request to ${this.url}`);
    return this.http.get<ReportArrayResponse>(this.url);
  }

  addReport(report: any) {
    console.log(`Sending POST request to ${this.url}/new`);
    return this.http.post(`${this.url}/new`, report, this.httpOptions);
  }
}
