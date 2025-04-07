import { computed } from '@angular/core';
import { FabricPattern } from '@models/fabric-pattern.model';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

type FabricPatternState = {
  userFabricPatterns: FabricPattern[];
};

const initialState: FabricPatternState = {
  userFabricPatterns: [],
};

export const FabricPatternStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUserFabricPatterns: (userFabricPatterns: FabricPattern[]) => {
      patchState(store, { userFabricPatterns });
    },
    clearUserFabricPatterns: () => {
      patchState(store, { userFabricPatterns: [] });
    },
  })),
  withComputed(({ userFabricPatterns }) => ({
    activeUserFabricPatterns: computed(() =>
      userFabricPatterns().filter((m) => m.active)
    ),
  }))
);
