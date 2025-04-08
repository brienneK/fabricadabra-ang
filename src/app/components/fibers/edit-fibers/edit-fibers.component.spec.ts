import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFibersComponent } from './edit-fibers.component';

describe('EditFibersComponent', () => {
  let component: EditFibersComponent;
  let fixture: ComponentFixture<EditFibersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFibersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFibersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
