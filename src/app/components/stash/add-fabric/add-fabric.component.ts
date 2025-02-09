import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Fabric } from '@models/fabric.model';
import { FabricService } from '@services/fabric.service';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

@Component({
  selector: 'app-add-fabric',
  imports: [FormsModule, MatButtonModule],
  templateUrl: './add-fabric.component.html',
  styleUrl: './add-fabric.component.scss',
})
export class AddFabricComponent {
  storage = inject(getStorage);
  analytics = inject(getAnalytics);
  fb = inject(FormBuilder);
  fabricService = inject(FabricService);

  addFabricForm = this.fb.group({
    fiber: [''],
    material: [''],
    pattern: [''],
    color: [''],
    source: [''],
    width: [0],
    length: [0],
    scrap: [false],
  });

  constructor() {}

  onSubmit() {
    this.addFabricForm.disable();
    const val = this.addFabricForm.value;
    const fabric: Partial<Fabric> = {
      fiber: val.fiber,
      material: val.material,
      pattern: val.pattern,
      color: val.color,
      source: val.source,
      width: val.width,
      length: val.length,
      scrap: val.scrap,
    };
    this.fabricService
      .addFabric('userId', fabric)
      .then(() => {
        this.addFabricForm.enable();
        this.addFabricForm.reset();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
