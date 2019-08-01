import { TestBed } from '@angular/core/testing';

import { CurrentMarkerService } from './current-marker.service';

describe('CurrentMarkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentMarkerService = TestBed.get(CurrentMarkerService);
    expect(service).toBeTruthy();
  });
});
