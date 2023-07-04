import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesAndViewsComponent } from './tables-and-views.component';

describe('TablesAndViewsComponent', () => {
  let component: TablesAndViewsComponent;
  let fixture: ComponentFixture<TablesAndViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablesAndViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesAndViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
