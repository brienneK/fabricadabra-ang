import { computed } from '@angular/core';
import { Fiber } from '@models/fiber.model';
import { withComputed } from '@ngrx/signals';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type FiberState = {
  userFibers: Fiber[];
};

const initialState: FiberState = {
  userFibers: [],
};

export const FiberStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUserFibers: (Fibers: Fiber[]) => {
      patchState(store, { userFibers: Fibers });
    },
    clearUserFibers: () => {
      patchState(store, { userFibers: [] });
    },
  })),
  withComputed(({ userFibers }) => ({
    activeUserFibers: computed(() => userFibers().filter((f) => f.active)),
  }))
);
