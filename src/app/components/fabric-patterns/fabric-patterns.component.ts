import {
  Component,
  inject,
  signal,
  Signal,
  model,
  computed,
} from '@angular/core';
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
import { FabricPattern } from '@models/fabric-pattern.model';
import { User } from '@models/user.model';
import { SortingService } from '@services/sorting.service';
import { LoadingService } from '@shared/loading/loading.service';
import { FabricPatternStore } from '@store/fabric-pattern.store';
import { UserStore } from '@store/user.store';
import { AddFabricPatternComponent } from './add-fabric-patterns/add-fabric-patterns.component';
import { EditFabricPatternComponent } from './edit-fabric-patterns/edit-fabric-patterns.component';

@Component({
  selector: 'app-fabric-patterns',
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
  templateUrl: './fabric-patterns.component.html',
  styleUrl: './fabric-patterns.component.scss',
})
export class FabricPatternsComponent {
  protected readonly router = inject(Router);
  protected readonly fabricPatternStore = inject(FabricPatternStore);
  protected readonly userStore = inject(UserStore);
  protected readonly sorter = inject(SortingService);
  protected readonly dialog = inject(MatDialog);
  protected readonly loading = inject(LoadingService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly panelOpenState = signal(false);

  currentUser: Signal<User> = this.userStore.user;
  #fabricPatterns: Signal<FabricPattern[]> =
    this.fabricPatternStore.userFabricPatterns;

  sortField = signal<string>('name');
  sortAsc = signal<boolean>(true);

  activeOnly = model<boolean>(true);
  nameFilter = model<string>('');

  filteredFabricPatterns = computed(() => {
    var fabricPatterns = this.#fabricPatterns().filter(
      (m: FabricPattern) => m.active || m.active == this.activeOnly()
    );
    if (fabricPatterns.length > 0) {
      fabricPatterns = this.sorter.sort(
        fabricPatterns,
        this.sortField(),
        this.sortAsc()
      );
    }
    return fabricPatterns;
  });

  sortFabricPatterns(e: { active: string; direction: string }): void {
    this.sortField.set(e.active);
    this.sortAsc.set(e.direction == 'asc');
  }

  addFabricPattern(): void {
    const dialogConfig: MatDialogConfig = {
      data: this.currentUser().id,
    };
    const dialogRef = this.dialog.open(AddFabricPatternComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.snackBar.open('FabricPattern added', 'OK');
      }
    });
  }

  onClick(fabricPattern: FabricPattern): void {
    const dialogConfig: MatDialogConfig = {
      data: { fabricPattern: fabricPattern, userId: this.currentUser().id },
    };
    const dialogRef = this.dialog.open(
      EditFabricPatternComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.snackBar.open(`FabricPattern ${result.operation}`, 'OK');
      }
    });
  }

  showHelp(): void {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      maxWidth: '80vw',
    };
    // this.dialog.open(FabricPatternHelpComponent, dialogConfig);
  }
}
