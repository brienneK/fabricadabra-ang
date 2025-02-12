import { Component, computed, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Fabric } from '@models/fabric.model';
import { FabricService } from '@services/fabric.service';
import { StashStore } from '@store/stash.store';
import { UserStore } from '@store/user.store';
import { getStorage } from 'firebase/storage';

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
  ],
  templateUrl: './stash.component.html',
  styleUrl: './stash.component.scss',
})
export class StashComponent {
  storage = inject(getStorage);
  fabricService = inject(FabricService);
  stashStore = inject(StashStore);
  userStore = inject(UserStore);

  fabrics: Signal<Fabric[]> = this.stashStore.stash;

  // This is a computed property that filters the fabrics by the selected fiber.
  filteredFabrics = computed(() => {});
}
