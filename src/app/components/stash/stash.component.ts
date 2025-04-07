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
import { FiberService } from '@services/fiber.service';
import { FiberStore } from '@store/fiber.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialStore } from '@store/material.store';
import { Material } from '@models/material.model';
import { FabricPattern } from '@models/fabric-pattern.model';
import { FabricPatternStore } from '@store/fabric-pattern.store';
import { Source } from '@models/source.model';
import { SourceStore } from '@store/source.store';
import { ColorStore } from '@store/color.store';
import { Color } from '@models/color.model';
import { DocumentReference } from 'firebase/firestore';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './stash.component.html',
  styleUrl: './stash.component.scss',
})
export class StashComponent {
  storage = inject(getStorage);
  fabricService = inject(FabricService);
  fiberService = inject(FiberService);
  sorter = inject(SortingService);
  router = inject(Router);
  loading = inject(LoadingService);
  stashStore = inject(StashStore);
  fiberStore = inject(FiberStore);
  userStore = inject(UserStore);
  materialStore = inject(MaterialStore);
  fabricPatternStore = inject(FabricPatternStore);
  colorStore = inject(ColorStore);
  sourceStore = inject(SourceStore);
  breakpointObserver = inject(BreakpointObserver);
  fabrics: Signal<Fabric[]> = this.stashStore.stash;
  materials: Signal<Material[]> = this.materialStore.userMaterials;
  fabricPatterns: Signal<FabricPattern[]> =
    this.fabricPatternStore.userFabricPatterns;
  colors: Signal<Color[]> = this.colorStore.userColors;
  sources: Signal<Source[]> = this.sourceStore.userSources;

  sortField = signal<string>('');
  sortAsc = signal<boolean>(true);
  columnsToDisplay = signal<string[]>([]);
  smallScreen = signal<boolean>(false);

  // Modified computed property that ensures we don't filter until data is loaded
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
            'fibers',
            'material',
            'pattern',
            'colors',
            'width',
            'length',
          ]);
          this.smallScreen.set(true);
        } else {
          this.columnsToDisplay.set([
            'fibers',
            'material',
            'pattern',
            'colors',
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

  getMaterialName(materialId: string): string {
    const material = this.materials().find((m) => m.id === materialId);
    return material?.name ?? 'Unknown Material';
  }

  getFabricPatternName(fabricPatternId: string): string {
    const pattern = this.fabricPatterns().find((p) => p.id === fabricPatternId);
    return pattern?.name ?? 'Unknown Pattern';
  }

  getSingleColorName(colorId: string): string {
    const color = this.colors().find((c) => c.id === colorId);
    return color?.name ?? 'Unknown';
  }
  // Get color name by ID
  getColorName(colorRefs: DocumentReference[]): string {
    switch (colorRefs.length) {
      case 1:
        return this.getSingleColorName(colorRefs[0].id);
      case 2:
        return `${this.getSingleColorName(
          colorRefs[0].id
        )} & ${this.getSingleColorName(colorRefs[1].id)}`;
      default:
        // For 3+ colors, create a comma-delimited list
        return colorRefs
          .map((ref, index) => {
            const colorName = this.getSingleColorName(ref.id);
            // Add "& " before the last item
            if (index === colorRefs.length - 1) {
              return `& ${colorName}`;
            }
            return colorName;
          })
          .join(', ');
    }
  }

  getSourceName(sourceId: string): string {
    const source = this.sources().find((s) => s.id === sourceId);
    return source?.name ?? 'Unknown Source';
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
