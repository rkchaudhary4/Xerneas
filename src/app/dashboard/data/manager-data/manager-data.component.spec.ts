import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagerDataComponent } from './manager-data.component';

describe('ManagerDataComponent', () => {
  let component: ManagerDataComponent;
  let fixture: ComponentFixture<ManagerDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
