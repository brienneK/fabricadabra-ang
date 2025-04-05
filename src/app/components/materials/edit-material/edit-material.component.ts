import { signal } from '@angular/core';
import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Material } from '@models/material.model';
import { MaterialService } from '@services/material.service';
import { DeleteDialogComponent } from '@shared/delete-dialog/delete-dialog.component';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-edit-material',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './edit-material.component.html',
  styleUrl: './edit-material.component.scss',
})
export class EditMaterialComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(MatDialogRef<EditMaterialComponent>);
  protected readonly fb = inject(FormBuilder);
  protected readonly materialService = inject(MaterialService);
  protected readonly dialog = inject(MatDialog);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly data: { material: Material; userId: string } =
    inject(MAT_DIALOG_DATA);

  #material = signal<Material>(this.data.material);

  editMaterialForm = this.fb.group({
    materialName: [this.data.material.name, Validators.required],
    active: [this.data.material.active],
  });

  public get f() {
    return this.editMaterialForm.controls;
  }

  onSubmit(): void {
    this.editMaterialForm.disable();
    const form = this.editMaterialForm.value;
    const changes: Partial<Material> = {
      name: form.materialName,
      active: form.active,
    };
    this.loading.loadingOn();
    this.materialService
      .updateMaterial(this.data.userId, this.#material().id, changes)
      .then((res) => {
        if (res?.name === 'Error') {
          this.snackBar.open(res.message, 'Close');
          this.editMaterialForm.enable();
        } else {
          this.dialogRef.close({
            success: true,
            operation: 'saved',
          });
        }
      })
      .catch((err: Error) => {
        console.log(err);
        this.snackBar.open(
          'Something went wrong - could not edit material.',
          'Close'
        );
        this.editMaterialForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }

  deleteMaterial(): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        operation: 'Delete',
        target: `material: ${this.#material().name}`,
      },
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.loading.loadingOn();
        this.materialService
          .deleteMaterial(this.data.userId, this.#material().id)
          .then((res) => {
            if (res?.name === 'Error') {
              this.snackBar.open(res.message, 'Close');
            } else {
              this.dialogRef.close({
                success: true,
                operation: 'deleted',
              });
            }
          })
          .catch((err: Error) => {
            this.snackBar.open(
              'Something went wrong - could not delete material.',
              'Close'
            );
          })
          .finally(() => this.loading.loadingOff());
      }
    });
  }
}
