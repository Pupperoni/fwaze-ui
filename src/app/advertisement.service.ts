import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "./../environments/environment";
import { Advertisement } from "./advertisement";
import { Observable } from "rxjs";

interface AdvertisementArrayResponse {
  ads: Advertisement[];
}
interface AdvertisementResponse {
  ad: Advertisement;
}

@Injectable({
  providedIn: "root"
})
export class AdvertisementService {
  private url = `http://${environment.APIUrl.HOST}:${
    environment.APIUrl.PORT
  }/map/ads`;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient) {}

  getAllAds(): Observable<AdvertisementArrayResponse> {
    console.log(`Submit GET request to ${this.url}`);
    return this.http.get<AdvertisementArrayResponse>(`${this.url}`);
  }

  addAd(ad: any) {
    console.log(`Sending POST request to ${this.url}/new`);
    return this.http.post(`${this.url}/new`, ad, this.httpOptions);
  }
}
