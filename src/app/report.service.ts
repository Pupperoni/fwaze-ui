import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Report } from "./report";
import { EventsSocket } from "./sockets";
import { environment } from "./../environments/environment";
import { CONSTANTS } from "../../constants";
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
  private url = `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/map/reports`;
  reportCreated = this.socket.fromEvent<any>(CONSTANTS.EVENTS.CREATE_REPORT);
  voteCreated = this.socket.fromEvent<any>(CONSTANTS.EVENTS.CREATE_REPORT_VOTE);
  voteDeleted = this.socket.fromEvent<any>(CONSTANTS.EVENTS.DELETE_REPORT_VOTE);
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient, private socket: EventsSocket) {}

  getAllReports(): Observable<ReportArrayResponse> {
    // console.log(`Sending GET request to ${this.url}`);
    return this.http.get<ReportArrayResponse>(this.url);
  }

  getAllReportsByBounds(tright, bleft): Observable<ReportArrayResponse> {
    // console.log(
    //   `Sending GET request to ${
    //     this.url
    //   }/range/?tright=${tright}&bleft=${bleft}`
    // );
    return this.http.get<ReportArrayResponse>(
      `${this.url}/range?tright=${tright}&bleft=${bleft}`
    );
  }

  getAllReportsByTypeBounds(
    type,
    tright,
    bleft
  ): Observable<ReportArrayResponse> {
    // console.log(
    //   `Sending GET request to ${
    //     this.url
    //   }/type/${type}/range/?tright=${tright}&bleft=${bleft}`
    // );
    return this.http.get<ReportArrayResponse>(
      `${this.url}/type/${type}/range?tright=${tright}&bleft=${bleft}`
    );
  }

  getReportById(id: string): Observable<ReportResponse> {
    // console.log(`Sending GET request to ${this.url}/${id}`);
    return this.http.get<ReportResponse>(`${this.url}/${id}`);
  }

  addReport(report: any) {
    // console.log(`Sending POST request to ${this.url}/new`);
    return this.http.post(`${this.url}/new`, report);
  }

  addVote(data) {
    // console.log(`Sending PUT request to ${this.url}/up`);
    return this.http.put(`${this.url}/up`, data, this.httpOptions);
  }

  deleteVote(data) {
    // console.log(`Sending PUT request to ${this.url}/down`);
    return this.http.put(`${this.url}/down`, data, this.httpOptions);
  }

  getUserVotePair(reportId, userId): Observable<VoterPair> {
    // console.log(
    //   `Sending GET request to ${this.url}/${reportId}/voted/${userId}`
    // );
    return this.http.get<VoterPair>(`${this.url}/${reportId}/voted/${userId}`);
  }

  getVoteCount(id): Observable<VoteResponse> {
    // console.log(`Sending GET request to ${this.url}/${id}/votes`);
    return this.http.get<VoteResponse>(`${this.url}/${id}/votes`);
  }

  visitMap() {
    let room = "map viewers";
    this.socket.emit("subscribe", room);
  }

  exitMap() {
    let room = "map viewers";
    this.socket.emit("unsubscribe", room);
  }

  viewMarker(data) {
    let room = `${CONSTANTS.AGGREGATES.REPORT_AGGREGATE_NAME} ${data}`;
    this.socket.emit("subscribe", room);
  }

  leaveMarker(data) {
    let room = `${CONSTANTS.AGGREGATES.REPORT_AGGREGATE_NAME} ${data}`;
    this.socket.emit("unsubscribe", room);
  }

  private getValues(form: any) {
    let data = {};
    for (let pair of form.entries()) {
      data[pair[0]] = pair[1];
    }

    return data;
  }
}
