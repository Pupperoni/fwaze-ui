import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { EventsSocket } from "./sockets";
import { CONSTANTS } from "../../constants";

@Injectable({
  providedIn: "root"
})
export class EventService {
  reportCreatedSubject = new Subject<any>();
  reportCommentCreatedSubject = new Subject<any>();
  reportVoteCreatedSubject = new Subject<any>();
  reportVoteDeletedSubject = new Subject<any>();

  adCreatedSubject = new Subject<any>();

  userUpdatedEventSubject = new Subject<any>();

  userApplicationRejectedEventSubject = new Subject<any>();
  userApplicationAcceptedEventSubject = new Subject<any>();
  userApplicationCreatedEventSubject = new Subject<any>();

  eventReceived = this.socket.fromEvent<any>("event_received");

  constructor(private socket: EventsSocket) {
    this.eventReceived.subscribe(event => {
      /* TO DO: Use Switch-Case */

      // reports aggregate
      if (event.eventName === CONSTANTS.EVENTS.REPORT_CREATED) {
        this.reportCreatedSubject.next(event.payload);
      } else if (event.eventName === CONSTANTS.EVENTS.REPORT_COMMENT_CREATED) {
        this.reportCommentCreatedSubject.next(event.payload);
      } else if (event.eventName === CONSTANTS.EVENTS.REPORT_VOTE_CREATED) {
        this.reportVoteCreatedSubject.next(event.payload);
      } else if (event.eventName === CONSTANTS.EVENTS.REPORT_VOTE_DELETED) {
        this.reportVoteDeletedSubject.next(event.payload);

        // ad aggregate
      } else if (event.eventName === CONSTANTS.EVENTS.AD_CREATED) {
        this.adCreatedSubject.next(event.payload);
      }

      // user aggregate
      else if (event.eventName === CONSTANTS.EVENTS.USER_UPDATED) {
        this.userUpdatedEventSubject.next(event.payload);
      } else if (
        event.eventName === CONSTANTS.EVENTS.USER_APPLICATION_REJECTED
      ) {
        this.userApplicationRejectedEventSubject.next(event.payload);
      } else if (
        event.eventName === CONSTANTS.EVENTS.USER_APPLICATION_APPROVED
      ) {
        this.userApplicationAcceptedEventSubject.next(event.payload);
      } else if (
        event.eventName === CONSTANTS.EVENTS.USER_APPLICATION_CREATED
      ) {
        this.userApplicationCreatedEventSubject.next(event.payload);
      }
    });
  }

  getReportCreatedEvents(): Observable<any> {
    return this.reportCreatedSubject.asObservable();
  }

  getReportCommentCreatedEvents(): Observable<any> {
    return this.reportCommentCreatedSubject.asObservable();
  }

  getReportVoteCreatedEvents(): Observable<any> {
    return this.reportVoteCreatedSubject.asObservable();
  }

  getReportVoteDeletedEvents(): Observable<any> {
    return this.reportVoteDeletedSubject.asObservable();
  }

  getAdCreatedEvents(): Observable<any> {
    return this.adCreatedSubject.asObservable();
  }

  getUserUpdatedEventSubject(): Observable<any> {
    return this.userUpdatedEventSubject.asObservable();
  }

  getUserApplicationRejectedEventSubject(): Observable<any> {
    return this.userApplicationRejectedEventSubject.asObservable();
  }

  getUserApplicationAcceptedEventSubject(): Observable<any> {
    return this.userApplicationAcceptedEventSubject.asObservable();
  }

  getUserApplicationCreatedEventSubject(): Observable<any> {
    return this.userApplicationCreatedEventSubject.asObservable();
  }
}
