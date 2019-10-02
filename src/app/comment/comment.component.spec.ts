import { CommentComponent } from "./comment.component";

describe("Comment component", () => {
  let component: CommentComponent;

  beforeEach(() => {
    component = new CommentComponent();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
