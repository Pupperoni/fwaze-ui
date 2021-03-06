import { Injectable } from "@angular/core";
import { EventsSocket } from "./sockets";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "./../environments/environment";
import { Observable } from "rxjs";
import { User } from "./user";
import { CONSTANTS } from "../../constants";

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
  private url = `http://${environment.UMSAPIUrl.HOST}:${environment.UMSAPIUrl.PORT}/users`;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  imageOptions = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
  };

  constructor(private http: HttpClient, private socket: EventsSocket) {}

  // HTTP methods here

  getAllUsers(): Observable<UserArrayResponse> {
    // console.log(`Submit GET request to ${this.url}`);
    return this.http.get<UserArrayResponse>(this.url);
  }

  registerUser(userData): Observable<any> {
    // console.log(`Submit POST request to ${this.url}/new`);
    return this.http.post(`${this.url}/new`, userData, this.httpOptions);
  }

  loginUser(userData): Observable<any> {
    // console.log(`Submit POST request to ${this.url}/login`);
    return this.http.post(`${this.url}/login`, userData, this.httpOptions);
  }

  getUser(id: string): Observable<UserResponse> {
    // console.log(`Submit GET request to ${this.url}/${id}`);
    return this.http.get<UserResponse>(`${this.url}/${id}`);
  }

  getImage(id: string): Observable<any> {
    // console.log(`Submit GET request to ${this.url}/${id}/image`);
    return this.http.get<any>(`${this.url}/${id}/image`);
  }

  updateUser(userData): Observable<any> {
    // console.log(`Submit PUT request to ${this.url}/edit`);
    return this.http.put(`${this.url}/edit`, userData);
  }

  addHomeAd(userData): Observable<any> {
    // console.log(`Submit PUT request to ${this.url}/home`);
    return this.http.put(`${this.url}/home`, userData);
  }

  addWorkAd(userData): Observable<any> {
    // console.log(`Submit PUT request to ${this.url}/work`);
    return this.http.put(`${this.url}/work`, userData);
  }

  addFaveRoute(routeData): Observable<any> {
    return this.http.post<any>(
      `${this.url}/faves/new`,
      routeData,
      this.httpOptions
    );
  }

  deleteFaveRoute(routeData): Observable<any> {
    return this.http.post<any>(
      `${this.url}/faves/delete`,
      routeData,
      this.httpOptions
    );
  }

  getfaveRoutes(userId): Observable<any> {
    return this.http.get<any>(`${this.url}/faves/${userId}`);
  }

  initUserRooms(data) {
    this.socket.emit("initialize", data);
  }

  loginUserSocket(data) {
    let currentData = {
      aggregateName: CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME,
      id: data.id,
      role: parseInt(data.role),
      offset: data.offset
    };
    this.socket.emit("subscribe", currentData);
  }

  logoutUserSocket(data) {
    let currentData = {
      aggregateName: CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME,
      id: data.id,
      offset: data.offset
    };
    this.socket.emit("unsubscribe", currentData);
  }
}
