import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricPatternsComponent } from './fabric-patterns.component';

describe('FabricPatternsComponent', () => {
  let component: FabricPatternsComponent;
  let fixture: ComponentFixture<FabricPatternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabricPatternsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabricPatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
