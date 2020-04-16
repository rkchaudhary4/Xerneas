import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaDataComponent } from './ta-data.component';

describe('TaDataComponent', () => {
  let component: TaDataComponent;
  let fixture: ComponentFixture<TaDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
