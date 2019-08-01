import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMarkersComponent } from './report-markers.component';

describe('ReportMarkersComponent', () => {
  let component: ReportMarkersComponent;
  let fixture: ComponentFixture<ReportMarkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMarkersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
