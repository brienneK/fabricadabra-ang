import { V } from '@angular/cdk/keycodes';
import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Material } from '@models/material.model';
import { MaterialService } from '@services/material.service';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-add-material',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './add-material.component.html',
  styleUrl: './add-material.component.scss',
})
export class AddMaterialComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(MatDialogRef<AddMaterialComponent>);
  protected readonly fb = inject(FormBuilder);
  protected readonly materialService = inject(MaterialService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly userId: string = inject(MAT_DIALOG_DATA);

  newMaterialForm = this.fb.group({
    materialName: ['', Validators.required],
  });

  public get f() {
    return this.newMaterialForm.controls;
  }

  onSubmit(): void {
    this.newMaterialForm.disable();
    const materialName = this.newMaterialForm.value.materialName;
    const newMaterial: Partial<Material> = {
      name: materialName,
      active: true,
    };
    this.loading.loadingOn();
    this.materialService
      .addMaterial(this.userId, newMaterial)
      .then((result) => {
        if (result?.name === 'Error') {
          this.snackBar.open(result.message, 'Close');
          this.newMaterialForm.enable();
        } else {
          this.dialogRef.close(true);
        }
      })
      .catch((err: Error) => {
        console.error(err);
        this.snackBar.open(
          'Something went wrong - could not add material.',
          'Close'
        );
        this.newMaterialForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }
}
