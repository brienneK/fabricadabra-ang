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
import { Source } from '@models/source.model';
import { SourceService } from '@services/source.service';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-add-sources',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './add-sources.component.html',
  styleUrl: './add-sources.component.scss',
})
export class AddSourcesComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(MatDialogRef<AddSourcesComponent>);
  protected readonly fb = inject(FormBuilder);
  protected readonly sourceService = inject(SourceService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly userId: string = inject(MAT_DIALOG_DATA);

  newSourceForm = this.fb.group({
    sourceName: ['', Validators.required],
  });

  public get f() {
    return this.newSourceForm.controls;
  }

  onSubmit(): void {
    this.newSourceForm.disable();
    const sourceName = this.newSourceForm.value.sourceName;
    const newSource: Partial<Source> = {
      name: sourceName,
      active: true,
    };
    this.loading.loadingOn();
    this.sourceService
      .addSource(this.userId, newSource)
      .then((result) => {
        if (result?.name === 'Error') {
          this.snackBar.open(result.message, 'Close');
          this.newSourceForm.enable();
        } else {
          this.dialogRef.close(true);
        }
      })
      .catch((err: Error) => {
        console.error(err);
        this.snackBar.open(
          'Something went wrong - could not add source.',
          'Close'
        );
        this.newSourceForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }
}
