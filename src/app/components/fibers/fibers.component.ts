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
import { Fiber } from '@models/fiber.model';
import { User } from '@models/user.model';
import { SortingService } from '@services/sorting.service';
import { LoadingService } from '@shared/loading/loading.service';
import { FiberStore } from '@store/fiber.store';
import { UserStore } from '@store/user.store';
import { AddFibersComponent } from './add-fibers/add-fibers.component';
import { EditFibersComponent } from './edit-fibers/edit-fibers.component';

@Component({
  selector: 'app-fibers',
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
  templateUrl: './fibers.component.html',
  styleUrl: './fibers.component.scss',
})
export class FibersComponent {
  protected readonly router = inject(Router);
  protected readonly fiberStore = inject(FiberStore);
  protected readonly userStore = inject(UserStore);
  protected readonly sorter = inject(SortingService);
  protected readonly dialog = inject(MatDialog);
  protected readonly loading = inject(LoadingService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly panelOpenState = signal(false);

  currentUser: Signal<User> = this.userStore.user;
  #fibers: Signal<Fiber[]> = this.fiberStore.userFibers;

  sortField = signal<string>('fiber');
  sortAsc = signal<boolean>(true);

  activeOnly = model<boolean>(true);
  nameFilter = model<string>('');

  filteredFibers = computed(() => {
    var fibers = this.#fibers().filter(
      (f: Fiber) => f.active || f.active == this.activeOnly()
    );
    if (fibers.length > 0) {
      fibers = this.sorter.sort(fibers, this.sortField(), this.sortAsc());
    }
    return fibers;
  });

  sortFibers(e: { active: string; direction: string }): void {
    this.sortField.set(e.active);
    this.sortAsc.set(e.direction == 'asc');
  }

  addUserFiber(): void {
    const dialogConfig: MatDialogConfig = {
      data: this.currentUser().id,
    };
    const dialogRef = this.dialog.open(AddFibersComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.snackBar.open('Fiber added', 'OK');
      }
    });
  }

  onClick(fiber: Fiber): void {
    const dialogConfig: MatDialogConfig = {
      data: { fiber: fiber, userId: this.currentUser().id },
    };
    const dialogRef = this.dialog.open(EditFibersComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.snackBar.open(`Fiber ${result.operation}`, 'OK');
      }
    });
  }

  showHelp(): void {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      maxWidth: '80vw',
    };
    // this.dialog.open(FiberHelpComponent, dialogConfig);
  }
}
