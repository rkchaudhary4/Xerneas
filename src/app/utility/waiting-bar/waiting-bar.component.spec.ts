import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WaitingBarComponent } from './waiting-bar.component';

describe('WaitingBarComponent', () => {
  let component: WaitingBarComponent;
  let fixture: ComponentFixture<WaitingBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
