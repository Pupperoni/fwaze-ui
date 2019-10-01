import { AdMarkersComponent } from "./ad-markers.component";
import { of } from "rxjs";

describe("Ad markers component", () => {
  let component: AdMarkersComponent;
  let mockAdService;
  let mockCookieService;

  beforeEach(() => {
    /**
     * Set up spy objects
     */
    mockAdService = jasmine.createSpyObj("mockAdService", ["getAdById"]);

    /**
     * Initialize component
     */
    component = new AdMarkersComponent(mockCookieService, mockAdService);

    /**
     * Set up component attributes
     */
    component.marker = {
      id: "adId",
      autoOpen: false,
      lat: 120,
      lng: -120,
      type: 2
    };

    component.currentUser = {
      id: "someUser",
      name: "user",
      role: 0,
      email: "email@no.com",
      home: null,
      work: null
    };
  });

  it("should create markerInfo", () => {
    // arrange
    let data = "adId";

    mockAdService.getAdById.and.callFake(id => {
      return of({
        ad: {
          id: "adId",
          lat: 10,
          lng: 9
        }
      });
    });

    // act
    component.toggleInfoWindow(data);

    // assert
    expect(component.markerInfo).toEqual({ id: "adId", lat: 10, lng: 9 });
  });

  it("should create markerInfo", () => {
    // arrange
    let data = "adId";

    mockAdService.getAdById.and.callFake(id => {
      return of({
        ad: {
          id: "adId",
          lat: 10,
          lng: 9,
          photoPath: "cool_image.png"
        }
      });
    });

    // act
    component.toggleInfoWindow(data);

    // assert
    expect(component.imagePath).toEqual(
      "http://localhost:3003/map/ads/adId/image"
    );
  });
});
