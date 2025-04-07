import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFabricPatternsComponent } from './add-fabric-patterns.component';

describe('AddFabricPatternsComponent', () => {
  let component: AddFabricPatternsComponent;
  let fixture: ComponentFixture<AddFabricPatternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFabricPatternsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFabricPatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
