import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaEditorComponent } from './ta-editor.component';

describe('TaEditorComponent', () => {
  let component: TaEditorComponent;
  let fixture: ComponentFixture<TaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
