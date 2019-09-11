import { Injectable } from "@angular/core";
import { EventsSocket } from "./sockets";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "./../environments/environment";
import { CONSTANTS } from "../../constants";
@Injectable({
  providedIn: "root"
})
export class CommentService {
  private url = `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/map/comments`;
  commentCreated = this.socket.fromEvent<any>(
    CONSTANTS.EVENTS.REPORT_COMMENT_CREATED
  );
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient, private socket: EventsSocket) {}

  createComment(data) {
    // console.log(`Sending POST request to ${this.url}/new`);
    return this.http.post(`${this.url}/new`, data, this.httpOptions);
  }

  getCommentsbyReport(report_id, pageNum) {
    // console.log(
    //   `Sending GET request to ${this.url}/report/${report_id}?page=${pageNum}`
    // );
    return this.http.get(`${this.url}/report/${report_id}?page=${pageNum}`);
  }

  countCommentsbyReport(report_id) {
    // console.log(`Sending GET request to ${this.url}/report/${report_id}/count`);
    return this.http.get(`${this.url}/report/${report_id}/count`);
  }

  viewComments(data) {
    let room = `${CONSTANTS.AGGREGATES.COMMENT_AGGREGATE_NAME} ${data}`;
    this.socket.emit("subscribe", room);
  }

  leaveComments(data) {
    let room = `${CONSTANTS.AGGREGATES.COMMENT_AGGREGATE_NAME} ${data}`;
    this.socket.emit("unsubscribe", room);
  }
}
