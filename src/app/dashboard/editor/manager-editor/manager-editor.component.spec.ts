import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagerEditorComponent } from './manager-editor.component';

describe('ManagerEditorComponent', () => {
  let component: ManagerEditorComponent;
  let fixture: ComponentFixture<ManagerEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
