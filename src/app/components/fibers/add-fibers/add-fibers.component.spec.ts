import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFibersComponent } from './add-fibers.component';

describe('AddFibersComponent', () => {
  let component: AddFibersComponent;
  let fixture: ComponentFixture<AddFibersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFibersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFibersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
