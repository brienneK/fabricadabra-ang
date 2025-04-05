import { computed } from '@angular/core';
import { Material } from '@models/material.model';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

type MaterialState = {
  userMaterials: Material[];
};

const initialState: MaterialState = {
  userMaterials: [],
};

export const MaterialStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUserMaterials: (userMaterials: Material[]) => {
      patchState(store, { userMaterials });
    },
    clearUserMaterials: () => {
      patchState(store, { userMaterials: [] });
    },
  })),
  withComputed(({ userMaterials }) => ({
    activeUserMaterials: computed(() =>
      userMaterials().filter((m) => m.active)
    ),
  }))
);
