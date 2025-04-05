import { Fiber } from '@models/fiber.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type FiberState = {
  fibers: Fiber[];
};

const initialState: FiberState = {
  fibers: [],
};

export const FiberStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setFibers: (Fibers: Fiber[]) => {
      patchState(store, { fibers: Fibers });
    },
    clearFibers: () => {
      patchState(store, { fibers: [] });
    },
  }))
);
