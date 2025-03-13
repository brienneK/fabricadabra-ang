import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Fabric } from '@models/fabric.model';
import { FabricService } from '@services/fabric.service';
import { UserStore } from '@store/user.store';

export const editFabricResolver: ResolveFn<Fabric> = (route) => {
  const fabricSerive = inject(FabricService);
  const userStore = inject(UserStore);
  const fabricId = route.paramMap.get('id');
  const userId = userStore.user().id;

  return fabricSerive.getFabric(userId, fabricId);
};
