import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFabricPatternsComponent } from './edit-fabric-patterns.component';

describe('EditFabricPatternsComponent', () => {
  let component: EditFabricPatternsComponent;
  let fixture: ComponentFixture<EditFabricPatternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFabricPatternsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFabricPatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
