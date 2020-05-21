import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillerSearchResultsComponent } from './biller-search-results.component';

describe('BillerSearchResultsComponent', () => {
  let component: BillerSearchResultsComponent;
  let fixture: ComponentFixture<BillerSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillerSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillerSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
