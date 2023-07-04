import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlLibraryComponent } from './sql-library.component';

describe('SqlLibraryComponent', () => {
  let component: SqlLibraryComponent;
  let fixture: ComponentFixture<SqlLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
