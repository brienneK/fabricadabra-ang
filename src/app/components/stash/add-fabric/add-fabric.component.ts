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
import { Timestamp } from 'firebase/firestore';
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
import { FormArray } from '@angular/forms';
import { MaterialStore } from '@store/material.store';
import { Material } from '@models/material.model';
import { Signal } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FabricPattern } from '@models/fabric-pattern.model';
import { FabricPatternStore } from '@store/fabric-pattern.store';
import { Source } from '@models/source.model';
import { SourceStore } from '@store/source.store';
import { ColorStore } from '@store/color.store';
import { Color } from '@models/color.model';

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
  protected readonly storage = inject(getStorage);
  protected readonly analytics = inject(getAnalytics);
  protected readonly fb = inject(FormBuilder);
  protected readonly fabricService = inject(FabricService);
  protected readonly userStore = inject(UserStore);
  protected readonly materialStore = inject(MaterialStore);
  protected readonly fabricPatternStore = inject(FabricPatternStore);
  protected readonly colorStore = inject(ColorStore);
  protected readonly sourceStore = inject(SourceStore);
  protected readonly router = inject(Router);

  datePicker = viewChild<ElementRef>('datePicker');
  materials: Signal<Material[]> = this.materialStore.userMaterials;
  fabricPatterns: Signal<FabricPattern[]> =
    this.fabricPatternStore.userFabricPatterns;
  colors: Signal<Color[]> = this.colorStore.userColors;
  sources: Signal<Source[]> = this.sourceStore.userSources;

  addFabricForm = this.fb.group({
    fibers: this.fb.array([], [Validators.required, Validators.minLength(1)]),
    material: ['', [Validators.required]],
    fabricPattern: ['', [Validators.required]],
    colors: [[], Validators.required],
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

  onMaterialChange(event: MatSelectChange) {
    const val = this.addFabricForm.value;
  }

  async onSubmit(submitAndAddAnother: boolean = false) {
    this.addFabricForm.disable();
    const val = this.addFabricForm.value;
    const fabric: Partial<Fabric> = {
      width: val.width,
      length: val.length,
      scrap: val.scrap,
      price: val.price,
      purchaseDate: new Date(val.purchaseDate),
      lastUpdated: new Date() as unknown as Timestamp,
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
      fibersList,
      val.material,
      val.fabricPattern,
      val.colors,
      val.source
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
