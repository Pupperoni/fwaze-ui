import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class WindowService {
  constructor() {}

  reload() {
    window.location.reload();
  }
}
