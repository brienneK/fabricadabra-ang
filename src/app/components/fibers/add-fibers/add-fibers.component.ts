import { inject } from '@angular/core';
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
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fiber } from '@models/fiber.model';
import { FiberService } from '@services/fiber.service';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-add-fibers',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './add-fibers.component.html',
  styleUrl: './add-fibers.component.scss',
})
export class AddFibersComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(MatDialogRef<AddFibersComponent>);
  protected readonly fb = inject(FormBuilder);
  protected readonly fiberService = inject(FiberService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly userId: string = inject(MAT_DIALOG_DATA);

  newFiberForm = this.fb.group({
    fiberName: ['', Validators.required],
  });

  public get f() {
    return this.newFiberForm.controls;
  }

  onSubmit(): void {
    this.newFiberForm.disable();
    const fiberName = this.newFiberForm.value.fiberName;
    const newFiber: Partial<Fiber> = {
      fiber: fiberName,
      active: true,
    };
    this.loading.loadingOn();
    this.fiberService
      .addUserFiber(this.userId, newFiber)
      .then((result) => {
        if (result?.name === 'Error') {
          this.snackBar.open(result.message, 'Close');
          this.newFiberForm.enable();
        } else {
          this.dialogRef.close(true);
        }
      })
      .catch((err: Error) => {
        console.error(err);
        this.snackBar.open(
          'Something went wrong - could not add fiber.',
          'Close'
        );
        this.newFiberForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }
}
