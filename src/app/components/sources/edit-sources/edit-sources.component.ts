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
import { Source } from '@models/source.model';
import { SourceService } from '@services/source.service';
import { DeleteDialogComponent } from '@shared/delete-dialog/delete-dialog.component';
import { LoadingService } from '@shared/loading/loading.service';

@Component({
  selector: 'app-edit-sources',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './edit-sources.component.html',
  styleUrl: './edit-sources.component.scss',
})
export class EditSourcesComponent {
  protected readonly loading = inject(LoadingService);
  protected readonly dialogRef = inject(MatDialogRef<EditSourcesComponent>);
  protected readonly fb = inject(FormBuilder);
  protected readonly sourceService = inject(SourceService);
  protected readonly dialog = inject(MatDialog);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly data: { source: Source; userId: string } =
    inject(MAT_DIALOG_DATA);

  #source = signal<Source>(this.data.source);

  editSourceForm = this.fb.group({
    sourceName: [this.data.source.name, Validators.required],
    active: [this.data.source.active],
  });

  public get f() {
    return this.editSourceForm.controls;
  }

  onSubmit(): void {
    this.editSourceForm.disable();
    const form = this.editSourceForm.value;
    const changes: Partial<Source> = {
      name: form.sourceName,
      active: form.active,
    };
    this.loading.loadingOn();
    this.sourceService
      .updateSource(this.data.userId, this.#source().id, changes)
      .then((res) => {
        if (res?.name === 'Error') {
          this.snackBar.open(res.message, 'Close');
          this.editSourceForm.enable();
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
          'Something went wrong - could not edit source.',
          'Close'
        );
        this.editSourceForm.enable();
      })
      .finally(() => this.loading.loadingOff());
  }

  deleteSource(): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        operation: 'Delete',
        target: `source: ${this.#source().name}`,
      },
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.loading.loadingOn();
        this.sourceService
          .deleteSource(this.data.userId, this.#source().id)
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
              'Something went wrong - could not delete source.',
              'Close'
            );
          })
          .finally(() => this.loading.loadingOff());
      }
    });
  }
}
