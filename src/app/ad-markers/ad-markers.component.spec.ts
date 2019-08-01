import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdMarkersComponent } from './ad-markers.component';

describe('AdMarkersComponent', () => {
  let component: AdMarkersComponent;
  let fixture: ComponentFixture<AdMarkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdMarkersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
