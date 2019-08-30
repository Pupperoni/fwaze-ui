import { Component, EventEmitter, OnInit, Input, Output } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-save-route-modal",
  templateUrl: "./save-route-modal.component.html",
  styleUrls: ["./save-route-modal.component.css"]
})
export class SaveRouteModalComponent implements OnInit {
  @Input() sourceString;
  @Input() destString;

  @Output() labelSubmit = new EventEmitter();

  routeForm: FormGroup;
  constructor() {}

  ngOnInit() {
    this.routeForm = new FormGroup({
      label: new FormControl("")
    });
  }

  onSubmit(formData) {
    if (formData.label == "") formData.label = "My Fave Route";
    this.labelSubmit.emit(formData);
    formData.label = "";
    this.routeForm.setValue({
      label: ""
    });
  }
}
