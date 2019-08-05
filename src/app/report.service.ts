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

interface VoteResponse {
  votes: number;
}

interface VoterPair {
  report: number;
  user: number;
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

  addVote(data) {
    console.log(`Sending PUT request to ${this.url}/up`);
    console.log(data);
    return this.http.put(`${this.url}/up`, data, this.httpOptions);
  }

  deleteVote(data) {
    console.log(`Sending PUT request to ${this.url}/down`);
    console.log(data);
    return this.http.put(`${this.url}/down`, data, this.httpOptions);
  }

  getUserVotePair(reportId, userId): Observable<VoterPair> {
    console.log(
      `Sending GET request to ${this.url}/${reportId}/voted/${userId}`
    );
    return this.http.get<VoterPair>(`${this.url}/${reportId}/voted/${userId}`);
  }

  getVoteCount(id): Observable<VoteResponse> {
    console.log(`Sending GET request to ${this.url}/${id}/votes`);
    return this.http.get<VoteResponse>(`${this.url}/${id}/votes`);
  }
}
