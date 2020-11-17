import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaCsvComponent } from './ta-csv.component';

describe('TaCsvComponent', () => {
  let component: TaCsvComponent;
  let fixture: ComponentFixture<TaCsvComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
