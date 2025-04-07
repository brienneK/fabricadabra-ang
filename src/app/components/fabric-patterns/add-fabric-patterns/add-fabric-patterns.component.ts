import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FabricPattern } from '@models/fabric-pattern.model';
import { FabricPatternService } from '@services/fabric-pattern.service';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-add-fabric-patterns',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './add-fabric-patterns.component.html',
  styleUrl: './add-fabric-patterns.component.scss',
})
export class AddFabricPatternComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(
    MatDialogRef<AddFabricPatternComponent>
  );
  protected readonly fb = inject(FormBuilder);
  protected readonly fabricPatternService = inject(FabricPatternService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly userId: string = inject(MAT_DIALOG_DATA);

  newFabricPatternForm = this.fb.group({
    fabricPatternName: ['', Validators.required],
  });

  public get f() {
    return this.newFabricPatternForm.controls;
  }

  onSubmit(): void {
    this.newFabricPatternForm.disable();
    const fabricPatternName = this.newFabricPatternForm.value.fabricPatternName;
    const newFabricPattern: Partial<FabricPattern> = {
      name: fabricPatternName,
      active: true,
    };
    this.loading.loadingOn();
    this.fabricPatternService
      .addFabricPattern(this.userId, newFabricPattern)
      .then((result) => {
        if (result?.name === 'Error') {
          this.snackBar.open(result.message, 'Close');
          this.newFabricPatternForm.enable();
        } else {
          this.dialogRef.close(true);
        }
      })
      .catch((err: Error) => {
        console.error(err);
        this.snackBar.open(
          'Something went wrong - could not add fabric pattern.',
          'Close'
        );
        this.newFabricPatternForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }
}
