import { Component, inject, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FabricPattern } from '@models/fabric-pattern.model';
import { FabricPatternService } from '@services/fabric-pattern.service';
import { DeleteDialogComponent } from '@shared/delete-dialog/delete-dialog.component';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-edit-fabricPattern',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './edit-fabric-patterns.component.html',
  styleUrl: './edit-fabric-patterns.component.scss',
})
export class EditFabricPatternComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(
    MatDialogRef<EditFabricPatternComponent>
  );
  protected readonly fb = inject(FormBuilder);
  protected readonly fabricPatternService = inject(FabricPatternService);
  protected readonly dialog = inject(MatDialog);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly data: { fabricPattern: FabricPattern; userId: string } =
    inject(MAT_DIALOG_DATA);

  #fabricPattern = signal<FabricPattern>(this.data.fabricPattern);

  editFabricPatternForm = this.fb.group({
    fabricPatternName: [this.data.fabricPattern.name, Validators.required],
    active: [this.data.fabricPattern.active],
  });

  public get f() {
    return this.editFabricPatternForm.controls;
  }

  onSubmit(): void {
    this.editFabricPatternForm.disable();
    const form = this.editFabricPatternForm.value;
    const changes: Partial<FabricPattern> = {
      name: form.fabricPatternName,
      active: form.active,
    };
    this.loading.loadingOn();
    this.fabricPatternService
      .updateFabricPattern(this.data.userId, this.#fabricPattern().id, changes)
      .then((res) => {
        if (res?.name === 'Error') {
          this.snackBar.open(res.message, 'Close');
          this.editFabricPatternForm.enable();
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
          'Something went wrong - could not edit fabricPattern.',
          'Close'
        );
        this.editFabricPatternForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }

  deleteFabricPattern(): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        operation: 'Delete',
        target: `fabricPattern: ${this.#fabricPattern().name}`,
      },
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.loading.loadingOn();
        this.fabricPatternService
          .deleteFabricPattern(this.data.userId, this.#fabricPattern().id)
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
              'Something went wrong - could not delete fabricPattern.',
              'Close'
            );
          })
          .finally(() => this.loading.loadingOff());
      }
    });
  }
}
