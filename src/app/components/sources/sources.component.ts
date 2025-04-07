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
import { Source } from '@models/source.model';
import { User } from '@models/user.model';
import { SortingService } from '@services/sorting.service';
import { LoadingService } from '@shared/loading/loading.service';
import { SourceStore } from '@store/source.store';
import { UserStore } from '@store/user.store';
import { AddSourcesComponent } from './add-sources/add-sources.component';
import { EditSourcesComponent } from './edit-sources/edit-sources.component';

@Component({
  selector: 'app-sources',
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
  templateUrl: './sources.component.html',
  styleUrl: './sources.component.scss',
})
export class SourcesComponent {
  protected readonly router = inject(Router);
  protected readonly sourceStore = inject(SourceStore);
  protected readonly userStore = inject(UserStore);
  protected readonly sorter = inject(SortingService);
  protected readonly dialog = inject(MatDialog);
  protected readonly loading = inject(LoadingService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly panelOpenState = signal(false);

  currentUser: Signal<User> = this.userStore.user;
  #sources: Signal<Source[]> = this.sourceStore.userSources;

  sortField = signal<string>('name');
  sortAsc = signal<boolean>(true);

  activeOnly = model<boolean>(true);
  nameFilter = model<string>('');

  filteredSources = computed(() => {
    var sources = this.#sources().filter(
      (m: Source) => m.active || m.active == this.activeOnly()
    );
    if (sources.length > 0) {
      sources = this.sorter.sort(sources, this.sortField(), this.sortAsc());
    }
    return sources;
  });

  sortSources(e: { active: string; direction: string }): void {
    this.sortField.set(e.active);
    this.sortAsc.set(e.direction == 'asc');
  }

  addSource(): void {
    const dialogConfig: MatDialogConfig = {
      data: this.currentUser().id,
    };
    const dialogRef = this.dialog.open(AddSourcesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.snackBar.open('Source added', 'OK');
      }
    });
  }

  onClick(source: Source): void {
    const dialogConfig: MatDialogConfig = {
      data: { source: source, userId: this.currentUser().id },
    };
    const dialogRef = this.dialog.open(EditSourcesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.snackBar.open(`Source ${result.operation}`, 'OK');
      }
    });
  }

  showHelp(): void {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      maxWidth: '80vw',
    };
    // this.dialog.open(SourceHelpComponent, dialogConfig);
  }
}
