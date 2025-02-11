import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserStore } from '@store/user.store';
import { Fabric } from '@models/fabric.model';
import { FabricService } from '@services/fabric.service';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-fabric',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
  ],
  templateUrl: './add-fabric.component.html',
  styleUrl: './add-fabric.component.scss',
})
export class AddFabricComponent {
  storage = inject(getStorage);
  analytics = inject(getAnalytics);
  fb = inject(FormBuilder);
  fabricService = inject(FabricService);
  userStore = inject(UserStore);

  get f() {
    return this.addFabricForm.controls;
  }

  addFabricForm = this.fb.group({
    fiber: ['', [Validators.required]],
    material: ['', [Validators.required]],
    pattern: ['', [Validators.required]],
    color: ['', [Validators.required]],
    width: [0, [Validators.required]],
    length: [0, [Validators.required]],
    source: [''],
    scrap: [false],
  });

  onSubmit() {
    this.addFabricForm.disable();
    const val = this.addFabricForm.value;
    const fabric: Partial<Fabric> = {
      fiber: val.fiber,
      material: val.material,
      pattern: val.pattern,
      color: val.color,
      width: val.width,
      length: val.length,
      source: val.source,
      scrap: val.scrap,
    };
    this.fabricService
      .addFabric(this.userStore.user().id, fabric)
      .then(() => {
        this.addFabricForm.enable();
        this.addFabricForm.reset();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
