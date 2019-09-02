import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CurrentMarkerService {
  currentMarker: marker;
  location: string;
  reportSubmit$: Observable<any>;
  adSubmit$: Observable<any>;
  voteIncr$: Observable<any>;
  voteDecr$: Observable<any>;

  // private currentMarkerSubject = new Subject<marker>();
  private reportSubmitSubject = new Subject<any>();
  private adSubmitSubject = new Subject<any>();
  private voteIncrSubject = new Subject<any>();
  private voteDecrSubject = new Subject<any>();

  constructor() {
    // this.currentMarker$ = this.currentMarkerSubject.asObservable();
    this.reportSubmit$ = this.reportSubmitSubject.asObservable();
    this.adSubmit$ = this.adSubmitSubject.asObservable();
    this.voteIncr$ = this.voteIncrSubject.asObservable();
    this.voteDecr$ = this.voteDecrSubject.asObservable();
  }

  getMarkerLocation() {
    return this.location;
  }

  getMarker() {
    return this.currentMarker;
  }

  setMarkerLocation(location) {
    this.location = location;
  }

  setMarker(marker) {
    this.currentMarker = marker;
  }

  reportSubmit(data) {
    this.reportSubmitSubject.next(data);
  }

  adSubmit(data) {
    this.adSubmitSubject.next(data);
  }

  voteIncr(index, data) {
    this.voteIncrSubject.next({ index: index, data: data });
  }

  voteDecr(index, data) {
    this.voteDecrSubject.next({ index: index, data: data });
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
}
