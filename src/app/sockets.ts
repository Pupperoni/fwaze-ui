import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { environment } from "./../environments/environment";

@Injectable()
export class EventsSocket extends Socket {
  constructor() {
    super({
      url: `http://${environment.PMSAPIUrl.HOST}:${environment.PMSAPIUrl.PORT}/events`,
      options: {}
    });
  }
}
