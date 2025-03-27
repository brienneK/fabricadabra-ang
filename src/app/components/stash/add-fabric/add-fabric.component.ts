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
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { viewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Fiber } from '@models/fiber.model';
import { Form } from '@angular/forms';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-fabric',
  imports: [
    RouterModule,
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
    MatDatepickerModule,
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
  protected readonly router = inject(Router);
  datePicker = viewChild<ElementRef>('datePicker');

  addFabricForm = this.fb.group({
    fibers: this.fb.array([], [Validators.required, Validators.minLength(1)]),
    material: ['', [Validators.required]],
    pattern: ['', [Validators.required]],
    color: ['', [Validators.required]],
    width: [0, [Validators.required]],
    length: [0, [Validators.required]],
    scrap: [false],
    source: [''],
    price: [0],
    purchaseDate: [new Date()],
  });

  ngOnInit() {
    // Add a default fiber row
    this.addFiber();
  }

  get f() {
    return this.addFabricForm.controls;
  }

  get fibersFormArray(): FormArray {
    return this.addFabricForm.get('fibers') as FormArray;
  }

  addFiber() {
    this.fibersFormArray.push(
      this.fb.group({
        fiber: ['', [Validators.required]],
        percentage: [0, [Validators.required]],
      })
    );
  }

  deleteFiber(index: number) {
    this.fibersFormArray.removeAt(index);
  }

  validateTotalPercentage() {
    const totalPercentage = this.fibersFormArray.controls.reduce(
      (total, control) => total + (control.get('percentage').value || 0),
      0
    );

    return totalPercentage === 100;
  }

  async onSubmit(submitAndAddAnother: boolean = false) {
    this.addFabricForm.disable();
    const val = this.addFabricForm.value;
    const fabric: Partial<Fabric> = {
      material: val.material,
      pattern: val.pattern,
      color: val.color,
      width: val.width,
      length: val.length,
      scrap: val.scrap,
      source: val.source,
      price: val.price,
      purchaseDate: new Date(val.purchaseDate),
    };

    // Prepare Fibers array
    const fibersList: Partial<Fiber>[] = this.fibersFormArray.value.map(
      (f: Fiber) => ({
        fiber: f.fiber,
        percentage: f.percentage,
      })
    );

    // Call the service method with all three arguments
    await this.fabricService.addFabric(
      this.userStore.user().id,
      fabric,
      fibersList
    );

    // Reset form and navigate
    this.addFabricForm.enable();
    this.addFabricForm.reset();

    if (submitAndAddAnother) {
      this.router.navigateByUrl('/add-fabric');
    } else {
      this.router.navigateByUrl('/stash');
    }
  }
  catch(err) {
    console.error('Error adding fabric and fibers:', err);
    this.addFabricForm.enable(); // Re-enable the form in case of error
  }

  onCancel() {
    this.router.navigateByUrl('/stash');
  }
}
