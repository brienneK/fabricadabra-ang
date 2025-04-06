import { signal } from '@angular/core';
import { ElementRef } from '@angular/core';
import { viewChild } from '@angular/core';
import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { Fabric } from '@models/fabric.model';
import { Fiber } from '@models/fiber.model';
import { FabricService } from '@services/fabric.service';
import { DeleteDialogComponent } from '@shared/delete-dialog/delete-dialog.component';
import { LoadingService } from '@shared/loading/loading.service';
import { StashStore } from '@store/stash.store';
import { UserStore } from '@store/user.store';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-edit-fabric',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    MatCheckbox,
    MatDatepickerModule,
    MatDialogModule,
  ],
  templateUrl: './edit-fabric.component.html',
  styleUrl: './edit-fabric.component.scss',
})
export class EditFabricComponent {
  protected readonly fb = inject(FormBuilder);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly loading = inject(LoadingService);
  protected readonly dialog = inject(MatDialog);
  protected readonly stashStore = inject(StashStore);
  protected readonly fabricService = inject(FabricService);
  protected readonly userStore = inject(UserStore);
  datePicker = viewChild<ElementRef>('datePicker');

  fabric = signal<Fabric>(null);

  editFabricForm = this.fb.group({
    fibers: this.fb.array(
      [],
      [
        Validators.required,
        Validators.minLength(1),
        this.totalPercentageValidator(),
      ]
    ),
    material: [''],
    pattern: [''],
    color: [''],
    width: [0],
    length: [0],
    scrap: [false],
    source: [''],
    price: [0],
    purchaseDate: [new Date()],
  });

  get f() {
    return this.editFabricForm.controls;
  }

  get fibersFormArray(): FormArray {
    return this.editFabricForm.get('fibers') as FormArray;
  }

  createFiberFormGroup(fiber?: Partial<Fiber>): FormGroup {
    return this.fb.group({
      fiber: [fiber?.fiber || '', Validators.required],
      percentage: [
        fiber?.percentage || 0,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
    });
  }

  addFiber(): void {
    this.fibersFormArray.push(this.createFiberFormGroup());
  }

  deleteFiber(index: number): void {
    this.fibersFormArray.removeAt(index);
  }

  totalPercentageValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (!(formArray instanceof FormArray)) {
        return null;
      }

      const sum = formArray.controls
        .map((control) => Number(control.get('percentage')?.value || 0))
        .reduce((acc, curr) => acc + curr, 0);

      return sum === 100 ? null : { totalPercentage: true };
    };
  }

  ngOnInit(): void {
    const fabric = this.route.snapshot.data.fabric;
    if (fabric) {
      this.fabric.set(fabric);
      this.editFabricForm.patchValue({
        material: fabric.material,
        pattern: fabric.pattern,
        color: fabric.color,
        width: fabric.width,
        length: fabric.length,
        scrap: fabric.scrap,
        source: fabric.source,
        price: fabric.price,
        purchaseDate: fabric.purchaseDate.toDate(),
      });

      // Clear and populate the fibers form array
      const fibersArray = this.editFabricForm.get('fibers') as FormArray;
      fibersArray.clear();

      if (fabric.fibers && fabric.fibers.length > 0) {
        fabric.fibers.forEach((fiber) => {
          fibersArray.push(this.createFiberFormGroup(fiber));
        });
      } else {
        // Add at least one empty fiber form group
        this.addFiber();
      }
    } else {
      console.log('Route data:', this.route.snapshot.data);
      console.log('Fabric object:', fabric);

      // Add an initial empty fiber form group
      this.addFiber();
    }
  }

  onSubmit(): void {
    this.editFabricForm.disable();
    const userId = this.userStore.user().id;
    const fabricId = this.fabric().id;
    const val = this.editFabricForm.value;
    const changes: Partial<Fabric> = {
      id: fabricId,
      pattern: val.pattern,
      color: val.color,
      width: val.width,
      length: val.length,
      scrap: val.scrap,
      source: val.source,
      price: val.price,
      purchaseDate: val.purchaseDate,
      lastUpdated: new Date() as unknown as Timestamp,
    };
    let fibers: Partial<Fiber>[] = [];
    this.fibersFormArray.value.forEach((f: any) => {
      const fiber: Partial<Fiber> = {
        fiber: f.fiber, // Now using f.fiber instead of f.fibers
        percentage: f.percentage,
      };
      fibers.push(fiber);
    });
    this.fabricService
      .updateFabric(userId, changes, fibers)
      .then(() => {
        this.router.navigate(['/stash']);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  onCancel(): void {
    this.router.navigate(['/stash']);
  }

  onDelete(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      operation: 'delete',
      target: 'this fabric',
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const userId = this.userStore.user().id;
        const fabricId = this.fabric().id;
        this.fabricService
          .deleteFabric(userId, fabricId)
          .then(() => {
            this.router.navigate(['/stash']);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  }
}
