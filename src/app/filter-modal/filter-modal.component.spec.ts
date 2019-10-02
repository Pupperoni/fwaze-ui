import { FilterModalComponent } from "./filter-modal.component";

describe("Filter modal component", () => {
  let component: FilterModalComponent;

  beforeEach(() => {
    component = new FilterModalComponent();
  });

  describe("is active", () => {
    it("should return correct value", () => {
      expect(component.isActive(0)).toBeTruthy();
      component.btnClicked[0].active = false;
      expect(component.isActive(0)).toBeFalsy();
      component.btnClicked[2].active = false;
      expect(component.isActive(2)).toBeFalsy();
      component.btnClicked[2].active = true;
      expect(component.isActive(2)).toBeTruthy();
    });
  });

  describe("is disabled", () => {
    it("should return correct value", () => {
      expect(component.isDisabled()).toBeFalsy();
      component.groupBtnClicked[0] = false;
      expect(component.isDisabled()).toBeTruthy();
    });
  });

  describe("is group active", () => {
    it("should return correct value", () => {
      expect(component.isGroupActive(0)).toBeTruthy();
      component.groupBtnClicked[0] = false;
      expect(component.isGroupActive(0)).toBeFalsy();
      component.groupBtnClicked[1] = false;
      expect(component.isGroupActive(1)).toBeFalsy();
      component.groupBtnClicked[1] = true;
      expect(component.isGroupActive(1)).toBeTruthy();
    });
  });

  describe("on button clicked", () => {
    it("should toggle button state", () => {
      expect(component.isActive(0)).toBeTruthy();
      component.onBtnClicked(0);
      expect(component.isActive(0)).toBeFalsy();
      component.onBtnClicked(0);
      expect(component.isActive(0)).toBeTruthy();
    });

    it("should not toggle when disabled", () => {
      expect(component.isActive(0)).toBeTruthy();
      component.groupBtnClicked[0] = false;
      component.onBtnClicked(0);
      expect(component.isActive(0)).toBeTruthy();
    });
  });

  describe("on group button clicked", () => {
    it("should toggle group button", () => {
      expect(component.groupBtnClicked[0]).toBeTruthy();
      component.onGroupBtnClicked(0);
      expect(component.groupBtnClicked[0]).toBeFalsy();
    });
  });
});
