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
  private reportSubmitSubject = new Subject<marker>();
  private adSubmitSubject = new Subject<marker>();
  private voteIncrSubject = new Subject<marker>();
  private voteDecrSubject = new Subject<marker>();

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

  voteIncr(data) {
    this.voteIncrSubject.next(data);
  }

  voteDecr(data) {
    this.voteDecrSubject.next(data);
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
}
