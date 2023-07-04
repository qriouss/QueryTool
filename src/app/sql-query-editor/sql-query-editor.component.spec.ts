import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlQueryEditorComponent } from './sql-query-editor.component';

describe('SqlQueryEditorComponent', () => {
  let component: SqlQueryEditorComponent;
  let fixture: ComponentFixture<SqlQueryEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlQueryEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlQueryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
