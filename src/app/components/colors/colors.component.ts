import { inject, signal, Signal, model, computed } from '@angular/core';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Color } from '@models/color.model';
import { User } from '@models/user.model';
import { SortingService } from '@services/sorting.service';
import { LoadingService } from '@shared/loading/loading.service';
import { ColorStore } from '@store/color.store';
import { UserStore } from '@store/user.store';
import { AddColorComponent } from './add-color/add-color.component';
import { EditColorComponent } from './edit-color/edit-color.component';

@Component({
  selector: 'app-colors',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatExpansionModule,
  ],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss',
})
export class ColorsComponent {
  protected readonly router = inject(Router);
  protected readonly colorStore = inject(ColorStore);
  protected readonly userStore = inject(UserStore);
  protected readonly sorter = inject(SortingService);
  protected readonly dialog = inject(MatDialog);
  protected readonly loading = inject(LoadingService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly panelOpenState = signal(false);

  currentUser: Signal<User> = this.userStore.user;
  #colors: Signal<Color[]> = this.colorStore.userColors;

  sortField = signal<string>('name');
  sortAsc = signal<boolean>(true);

  activeOnly = model<boolean>(true);
  nameFilter = model<string>('');

  filteredColors = computed(() => {
    var colors = this.#colors().filter(
      (c: Color) => c.active || c.active == this.activeOnly()
    );
    if (colors.length > 0) {
      colors = this.sorter.sort(colors, this.sortField(), this.sortAsc());
    }
    return colors;
  });

  sortColors(e: { active: string; direction: string }): void {
    this.sortField.set(e.active);
    this.sortAsc.set(e.direction == 'asc');
  }

  addColor(): void {
    const dialogConfig: MatDialogConfig = {
      data: this.currentUser().id,
    };
    const dialogRef = this.dialog.open(AddColorComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.snackBar.open('Color added', 'OK');
      }
    });
  }

  onClick(color: Color): void {
    const dialogConfig: MatDialogConfig = {
      data: { color: color, userId: this.currentUser().id },
    };
    const dialogRef = this.dialog.open(EditColorComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.snackBar.open(`Color ${result.operation}`, 'OK');
      }
    });
  }

  showHelp(): void {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      maxWidth: '80vw',
    };
    // this.dialog.open(ColorHelpComponent, dialogConfig);
  }
}
