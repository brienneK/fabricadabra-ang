import { computed, inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { Fabric } from '../models/fabric.model';
import { StashStore } from '@store/stash.store';
import { Fiber } from '@models/fiber.model';

@Injectable({
  providedIn: 'root',
})
export class FabricService {
  fs = inject(getFirestore);
  stashStore = inject(StashStore);

  getFabrics(userId: string): void {
    const c = collection(this.fs, `users/${userId}/fabrics`);
    const q = query(c, orderBy('length', 'desc'));
    onSnapshot(q, (snapshot) => {
      const fabrics = [
        ...snapshot.docs.map(
          (doc) => new Fabric({ id: doc.id, ...doc.data() })
        ),
      ];
      this.stashStore.setStash(fabrics);
    });
  }

  async getFabric(userId: string, fabricId: string): Promise<Fabric> {
    const d = doc(this.fs, `users/${userId}/fabrics/${fabricId}`);
    const fabricDoc = await getDoc(d);
    if (!fabricDoc.exists()) {
      throw new Error('Fabric not found');
    }
    const fabric = new Fabric({ id: fabricDoc.id, ...fabricDoc.data() });
    return fabric;
  }

  async addFabric(
    userId: string,
    fabric: Partial<Fabric>,
    fibers: Partial<Fiber>[]
  ): Promise<any> {
    const c = collection(this.fs, `users/${userId}/fabrics`);
    fibers.forEach((fiber) => {});
    return await addDoc(c, fabric);
  }

  async updateFabric(
    userId: string,
    fabric: Partial<Fabric>,
    fibers: Partial<Fiber>[]
  ): Promise<any> {
    const d = doc(this.fs, `users/${userId}/fabrics/${fabric.id}`);
    fibers.forEach((fiber) => {});
    return await updateDoc(d, fabric);
  }

  async deleteFabric(userId: string, fabricId: string): Promise<any> {
    const d = doc(this.fs, `users/${userId}/fabrics/${fabricId}`);
    return await deleteDoc(d);
  }
}
