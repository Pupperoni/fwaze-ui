import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { environment } from "./../environments/environment";

import { CookieService } from "ngx-cookie-service";

@Injectable()
export class EventsSocket extends Socket {
  constructor(private cookieService: CookieService) {
    super({
      url: `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/events`,
      options: {
        query: {
          userId: cookieService.get("currentUser")
            ? JSON.parse(cookieService.get("currentUser")).id
            : ""
        }
      }
    });
  }
}
