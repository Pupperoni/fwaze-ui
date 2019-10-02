import { SaveRouteModalComponent } from "./save-route-modal.component";

describe("Save route modal", () => {
  let component: SaveRouteModalComponent;

  beforeEach(() => {
    component = new SaveRouteModalComponent();
  });

  describe("on submit", () => {
    it("should reset label", () => {
      let data = { label: "boo" };

      component.ngOnInit();
      component.onSubmit(data);

      expect(component.routeForm.get("label").value).toEqual("");
    });
  });
});
