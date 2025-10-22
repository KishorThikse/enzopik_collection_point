import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oil } from './oil';

describe('Oil', () => {
  let component: Oil;
  let fixture: ComponentFixture<Oil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Oil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Oil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
