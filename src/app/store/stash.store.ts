import { computed } from '@angular/core';
import { Fabric } from '@models/fabric.model';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

type StashState = {
  stash: Fabric[];
};

const initialState: StashState = {
  stash: [],
};

export const StashStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setStash: (stash: Fabric[]) => {
      patchState(store, { stash: stash });
    },
    clearStash: () => {
      patchState(store, { stash: [] });
    },
  })),
  withComputed(({ stash }) => ({
    allFabricCount: computed(() => stash().length),
    totalYards: computed(() =>
      stash().length > 0
        ? Math.floor(
            stash().reduce(
              (totalLength, fabric) => totalLength + fabric.length,
              0
            ) / 36
          )
        : 0
    ),
    remainingInches: computed(
      () =>
        stash().reduce(
          (totalLength, fabric) => totalLength + fabric.length,
          0
        ) % 36
    ),
    scraps: computed(() => stash().filter((fabric) => fabric.scrap)),
    notScraps: computed(() => stash().filter((fabric) => !fabric.scrap)),
    availableFabrics: computed(() =>
      stash().filter((fabric) => fabric.length > 0)
    ),
    availableFabricCount: computed(
      () => stash().filter((fabric) => fabric.length > 0).length
    ),
  }))
);
