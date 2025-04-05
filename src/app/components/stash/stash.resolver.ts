import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FabricService } from '../../services/fabric.service';
import { StashStore } from '@store/stash.store';
import { UserStore } from '@store/user.store';

// Modern Angular recommends standalone resolvers
export const stashResolver: ResolveFn<boolean> = async () => {
  const fabricService = inject(FabricService);
  const userStore = inject(UserStore);
  const user = userStore.user();

  if (!user) {
    return false;
  }

  try {
    // This will update the stash store via the service
    await fabricService.getFabrics(user.id);
    return true;
  } catch (error) {
    console.error('Error loading fabric data:', error);
    return false;
  }
};
