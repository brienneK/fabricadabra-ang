import { BreakpointObserver } from '@angular/cdk/layout';
import { signal } from '@angular/core';
import { Component, computed, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { LoadingService } from '@shared/loading/loading.service';
import { Fabric } from '@models/fabric.model';
import { FabricService } from '@services/fabric.service';
import { SortingService } from '@services/sorting.service';
import { StashStore } from '@store/stash.store';
import { UserStore } from '@store/user.store';
import { getStorage } from 'firebase/storage';
import { CheckmarkPipe } from '@shared/pipes/checkmark.pipe';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stash',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MatInputModule,
    RouterLink,
    CheckmarkPipe,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './stash.component.html',
  styleUrl: './stash.component.scss',
})
export class StashComponent {
  storage = inject(getStorage);
  fabricService = inject(FabricService);
  sorter = inject(SortingService);
  router = inject(Router);
  loading = inject(LoadingService);
  stashStore = inject(StashStore);
  userStore = inject(UserStore);
  breakpointObserver = inject(BreakpointObserver);
  fabrics: Signal<Fabric[]> = this.stashStore.stash;

  sortField = signal<string>('');
  sortAsc = signal<boolean>(true);
  columnsToDisplay = signal<string[]>([]);
  smallScreen = signal<boolean>(false);

  filteredFabrics = computed(() => {
    const stash = this.fabrics();
    if (stash.length === 0) {
      return [];
    }
    const filtered = stash.filter((fabric) => {
      return fabric.length > 0;
    });
    return this.sorter.sort(filtered, this.sortField(), this.sortAsc());
  });

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(max-width: 1009px)')
      .subscribe((result) => {
        if (result.matches) {
          this.columnsToDisplay.set([
            'fiber',
            'material',
            'pattern',
            'color',
            'width',
            'length',
          ]);
          this.smallScreen.set(true);
        } else {
          this.columnsToDisplay.set([
            'fiber',
            'material',
            'pattern',
            'color',
            'width',
            'length',
            'scrap',
            'source',
            'purchaseDate',
            'price',
          ]);
          this.smallScreen.set(false);
        }
      });
  }

  sortFabrics(e: { active: string; direction: string }): void {
    this.sortField.set(e.active);
    this.sortAsc.set(e.direction == 'asc');
  }

  onRowClick(fabric: Fabric): void {
    this.loading.loadingOn();
    this.router.navigate(['/edit-fabric', fabric.id]);
  }
}
