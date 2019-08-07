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

  getAllAdsByBounds(tright, bleft): Observable<AdvertisementArrayResponse> {
    console.log(
      `Sending GET request to ${
        this.url
      }/range/?tright=${tright}&bleft=${bleft}`
    );
    return this.http.get<AdvertisementArrayResponse>(
      `${this.url}/range?tright=${tright}&bleft=${bleft}`
    );
  }

  getAdById(id: string): Observable<AdvertisementResponse> {
    console.log(`Submit GET request to ${this.url}/${id}`);
    return this.http.get<AdvertisementResponse>(`${this.url}/${id}`);
  }

  addAd(ad: any) {
    console.log(`Sending POST request to ${this.url}/new`);
    return this.http.post(`${this.url}/new`, ad, this.httpOptions);
  }
}
