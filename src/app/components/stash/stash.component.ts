import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Fabric } from '@models/fabric.model';
import { FabricService } from '@services/fabric.service';
import { StashStore } from '@store/stash.store';

@Component({
  selector: 'app-stash',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './stash.component.html',
  styleUrl: './stash.component.scss',
})
export class StashComponent {
  fabricService = inject(FabricService);
  stashStore = inject(StashStore);

  fabrics: Signal<Fabric[]> = this.stashStore.stash;

  // This is a computed property that filters the fabrics by the selected fiber.
  filteredFabrics = computed(() => {});
}
