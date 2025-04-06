import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { SortingService } from '@services/sorting.service';
import { LoadingService } from '@shared/loading/loading.service';
import { ActiveInactivePipe } from '@shared/pipes/active-inactive.pipe';
import { UserStore } from '@store/user.store';
import { MaterialStore } from '@store/material.store';
import { Signal } from '@angular/core';
import { User } from '@models/user.model';
import { Material } from '@models/material.model';
import { signal, model } from '@angular/core';
import { computed } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddMaterialComponent } from './add-material/add-material.component';
import { EditMaterialComponent } from './edit-material/edit-material.component';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-materials',
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
    ActiveInactivePipe,
  ],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
})
export class MaterialsComponent {
  protected readonly router = inject(Router);
  protected readonly materialStore = inject(MaterialStore);
  protected readonly userStore = inject(UserStore);
  protected readonly sorter = inject(SortingService);
  protected readonly dialog = inject(MatDialog);
  protected readonly loading = inject(LoadingService);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly panelOpenState = signal(false);

  currentUser: Signal<User> = this.userStore.user;
  #materials: Signal<Material[]> = this.materialStore.userMaterials;

  sortField = signal<string>('name');
  sortAsc = signal<boolean>(true);

  activeOnly = model<boolean>(true);
  nameFilter = model<string>('');

  filteredMaterials = computed(() => {
    var materials = this.#materials().filter(
      (m: Material) => m.active || m.active == this.activeOnly()
    );
    if (materials.length > 0) {
      materials = this.sorter.sort(materials, this.sortField(), this.sortAsc());
    }
    return materials;
  });

  sortMaterials(e: { active: string; direction: string }): void {
    this.sortField.set(e.active);
    this.sortAsc.set(e.direction == 'asc');
  }

  addMaterial(): void {
    const dialogConfig: MatDialogConfig = {
      data: this.currentUser().id,
    };
    const dialogRef = this.dialog.open(AddMaterialComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.snackBar.open('Material added', 'OK');
      }
    });
  }

  onClick(material: Material): void {
    const dialogConfig: MatDialogConfig = {
      data: { material: material, userId: this.currentUser().id },
    };
    const dialogRef = this.dialog.open(EditMaterialComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.snackBar.open(`Material ${result.operation}`, 'OK');
      }
    });
  }

  showHelp(): void {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      maxWidth: '80vw',
    };
    // this.dialog.open(MaterialHelpComponent, dialogConfig);
  }
}
