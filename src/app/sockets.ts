import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { environment } from "./../environments/environment";

@Injectable()
export class EventsSocket extends Socket {
  constructor() {
    super({
      url: `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/events`,
      options: {}
    });
  }
}
