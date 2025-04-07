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
import { Color } from '@models/color.model';
import { ColorService } from '@services/color.service';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-add-color',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './add-color.component.html',
  styleUrl: './add-color.component.scss',
})
export class AddColorComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(MatDialogRef<AddColorComponent>);
  protected readonly fb = inject(FormBuilder);
  protected readonly colorService = inject(ColorService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly userId: string = inject(MAT_DIALOG_DATA);

  newColorForm = this.fb.group({
    colorName: ['', Validators.required],
  });

  public get f() {
    return this.newColorForm.controls;
  }

  onSubmit(): void {
    this.newColorForm.disable();
    const colorName = this.newColorForm.value.colorName;
    const newColor: Partial<Color> = {
      name: colorName,
      active: true,
    };
    this.loading.loadingOn();
    this.colorService
      .addColor(this.userId, newColor)
      .then((result) => {
        if (result?.name === 'Error') {
          this.snackBar.open(result.message, 'Close');
          this.newColorForm.enable();
        } else {
          this.dialogRef.close(true);
        }
      })
      .catch((err: Error) => {
        console.error(err);
        this.snackBar.open(
          'Something went wrong - could not add color.',
          'Close'
        );
        this.newColorForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }
}
