import { computed } from '@angular/core';
import { Source } from '@models/source.model';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

type SourceState = {
  userSources: Source[];
};

const initialState: SourceState = {
  userSources: [],
};

export const SourceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUserSources: (userSources: Source[]) => {
      patchState(store, { userSources });
    },
    clearUserSources: () => {
      patchState(store, { userSources: [] });
    },
  })),
  withComputed(({ userSources }) => ({
    activeUserSources: computed(() => userSources().filter((s) => s.active)),
  }))
);
