import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class NavigatorService {
  constructor() {}

  getNavigator() {
    return navigator;
  }
}
