import { signal } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
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
import { Color } from '@models/color.model';
import { ColorService } from '@services/color.service';
import { DeleteDialogComponent } from '@shared/delete-dialog/delete-dialog.component';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-edit-color',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './edit-color.component.html',
  styleUrl: './edit-color.component.scss',
})
export class EditColorComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(MatDialogRef<EditColorComponent>);
  protected readonly fb = inject(FormBuilder);
  protected readonly colorService = inject(ColorService);
  protected readonly dialog = inject(MatDialog);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly data: { color: Color; userId: string } =
    inject(MAT_DIALOG_DATA);

  #color = signal<Color>(this.data.color);

  editColorForm = this.fb.group({
    colorName: [this.data.color.name, Validators.required],
    active: [this.data.color.active],
  });

  public get f() {
    return this.editColorForm.controls;
  }

  onSubmit(): void {
    this.editColorForm.disable();
    const form = this.editColorForm.value;
    const changes: Partial<Color> = {
      name: form.colorName,
      active: form.active,
    };
    this.loading.loadingOn();
    this.colorService
      .updateColor(this.data.userId, this.#color().id, changes)
      .then((res) => {
        if (res?.name === 'Error') {
          this.snackBar.open(res.message, 'Close');
          this.editColorForm.enable();
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
          'Something went wrong - could not edit color.',
          'Close'
        );
        this.editColorForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }

  deleteColor(): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        operation: 'Delete',
        target: `color: ${this.#color().name}`,
      },
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.loading.loadingOn();
        this.colorService
          .deleteColor(this.data.userId, this.#color().id)
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
              'Something went wrong - could not delete color.',
              'Close'
            );
          })
          .finally(() => this.loading.loadingOff());
      }
    });
  }
}
