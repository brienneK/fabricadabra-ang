import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibersComponent } from './fibers.component';

describe('FibersComponent', () => {
  let component: FibersComponent;
  let fixture: ComponentFixture<FibersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FibersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FibersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
