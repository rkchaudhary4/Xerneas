import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataComponent } from './admin-data.component';

describe('AdminDataComponent', () => {
  let component: AdminDataComponent;
  let fixture: ComponentFixture<AdminDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
