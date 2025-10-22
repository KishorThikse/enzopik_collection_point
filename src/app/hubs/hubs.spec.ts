import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hubs } from './hubs';

describe('Hubs', () => {
  let component: Hubs;
  let fixture: ComponentFixture<Hubs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Hubs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hubs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
