import { computed } from '@angular/core';
import { Color } from '@models/color.model';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

type ColorState = {
  userColors: Color[];
};

const initialState: ColorState = {
  userColors: [],
};

export const ColorStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUserColors: (userColors: Color[]) => {
      patchState(store, { userColors });
    },
    clearUserColors: () => {
      patchState(store, { userColors: [] });
    },
  })),
  withComputed(({ userColors }) => ({
    activeUserColors: computed(() => userColors().filter((m) => m.active)),
  }))
);
