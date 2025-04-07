import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSourcesComponent } from './edit-sources.component';

describe('EditSourcesComponent', () => {
  let component: EditSourcesComponent;
  let fixture: ComponentFixture<EditSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
