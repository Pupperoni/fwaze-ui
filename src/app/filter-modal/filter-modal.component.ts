import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-filter-modal",
  templateUrl: "./filter-modal.component.html",
  styleUrls: ["./filter-modal.component.css"]
})
export class FilterModalComponent implements OnInit {
  @Output() setFilters = new EventEmitter();
  btnClicked = [
    { name: "Traffic Jam", apiName: "traffic_jam", active: true },
    { name: "Heavy Traffic Jam", apiName: "heavy_traffic_jam", active: true },
    { name: "Police", apiName: "police", active: true },
    { name: "Road Closed", apiName: "closed_road", active: true },
    { name: "Car Stopped", apiName: "car_stopped", active: true },
    { name: "Construction", apiName: "construction", active: true },
    { name: "Minor Accident", apiName: "minor_accident", active: true },
    { name: "Major Accident", apiName: "major_accident", active: true },
    { name: "Others", apiName: "others", active: true }
  ];

  groupBtnClicked = [true, true];

  constructor() {}

  ngOnInit() {}

  // returns 1 if the button is active else 0
  isActive(btnIndex: number) {
    return this.btnClicked[btnIndex].active;
  }

  isDisabled() {
    return !this.groupBtnClicked[0];
  }

  isGroupActive(index: number) {
    return this.groupBtnClicked[index];
  }

  // toggle button state
  onBtnClicked(btnIndex: number) {
    if (this.groupBtnClicked[0])
      this.btnClicked[btnIndex].active = !this.btnClicked[btnIndex].active;
  }

  onGroupBtnClicked(index: number) {
    this.groupBtnClicked[index] = !this.groupBtnClicked[index];
  }

  filterSubmit() {
    this.setFilters.emit({
      group: this.groupBtnClicked,
      type: this.btnClicked
    });
  }
}
