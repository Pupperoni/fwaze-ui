import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { environment } from "./../environments/environment";

import { CookieService } from "ngx-cookie-service";
@Injectable()
export class UsersSocket extends Socket {
  constructor() {
    super({
      url: `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/events`,
      options: {}
    });
  }
}

@Injectable()
export class ReportsSocket extends Socket {
  constructor() {
    super({
      url: `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/reports`,
      options: {}
    });
  }
}

@Injectable()
export class CommentsSocket extends Socket {
  constructor() {
    super({
      url: `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/comments`,
      options: {}
    });
  }
}

@Injectable()
export class AdsSocket extends Socket {
  constructor() {
    super({
      url: `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/ads`,
      options: {}
    });
  }
}

@Injectable()
export class ApplicationsSocket extends Socket {
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
