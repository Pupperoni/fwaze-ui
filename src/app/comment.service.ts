import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "./../environments/environment";
@Injectable({
  providedIn: "root"
})
export class CommentService {
  private url = `http://${environment.APIUrl.HOST}:${
    environment.APIUrl.PORT
  }/map/comments`;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient) {}

  createComment(data) {
    console.log(`Sending POST request to ${this.url}/new`);
    return this.http.post(`${this.url}/new`, data, this.httpOptions);
  }

  getCommentsbyReport(report_id) {
    console.log(`Sending GET request to ${this.url}/report/${report_id}`);
    return this.http.get(`${this.url}/report/${report_id}`);
  }
}