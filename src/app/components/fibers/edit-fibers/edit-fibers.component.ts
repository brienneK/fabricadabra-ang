import { inject, signal } from '@angular/core';
import { Component } from '@angular/core';
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
import { Fiber } from '@models/fiber.model';
import { FiberService } from '@services/fiber.service';
import { DeleteDialogComponent } from '@shared/delete-dialog/delete-dialog.component';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-edit-fibers',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './edit-fibers.component.html',
  styleUrl: './edit-fibers.component.scss',
})
export class EditFibersComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(MatDialogRef<EditFibersComponent>);
  protected readonly fb = inject(FormBuilder);
  protected readonly fiberService = inject(FiberService);
  protected readonly dialog = inject(MatDialog);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly data: { fiber: Fiber; userId: string } =
    inject(MAT_DIALOG_DATA);

  #fiber = signal<Fiber>(this.data.fiber);

  editFiberForm = this.fb.group({
    fiberName: [this.data.fiber.fiber, Validators.required],
    active: [this.data.fiber.active],
  });

  public get f() {
    return this.editFiberForm.controls;
  }

  onSubmit(): void {
    this.editFiberForm.disable();
    const form = this.editFiberForm.value;
    const changes: Partial<Fiber> = {
      fiber: form.fiberName,
      active: form.active,
    };
    this.loading.loadingOn();
    this.fiberService
      .updateUserFiber(this.data.userId, this.#fiber().id, changes)
      .then((res) => {
        if (res?.name === 'Error') {
          this.snackBar.open(res.message, 'Close');
          this.editFiberForm.enable();
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
          'Something went wrong - could not edit fiber.',
          'Close'
        );
        this.editFiberForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }

  deleteUserFiber(): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        operation: 'Delete',
        target: `fiber: ${this.#fiber().fiber}`,
      },
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.loading.loadingOn();
        this.fiberService
          .deleteUserFiber(this.data.userId, this.#fiber().id)
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
              'Something went wrong - could not delete fiber.',
              'Close'
            );
          })
          .finally(() => this.loading.loadingOff());
      }
    });
  }
}
