import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagerCsvComponent } from './manager-csv.component';

describe('ManagerCsvComponent', () => {
  let component: ManagerCsvComponent;
  let fixture: ComponentFixture<ManagerCsvComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
