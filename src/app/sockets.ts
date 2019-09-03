import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { environment } from "./../environments/environment";

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
  constructor() {
    super({
      url: `http://${environment.APIUrl.HOST}:${environment.APIUrl.PORT}/applications`,
      options: {}
    });
  }
}
