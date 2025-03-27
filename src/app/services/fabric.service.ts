import { computed, inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
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
    // Create a batch to handle fabric and fibers atomically
    const batch = writeBatch(this.fs);
    const fabricsCollection = collection(this.fs, `users/${userId}/fabrics`);
    const fabricDocRef = doc(fabricsCollection);
    batch.set(fabricDocRef, fabric);

    // Add fibers as a subcollection
    if (fibers && fibers.length > 0) {
      const fibersCollection = collection(fabricDocRef, 'fibers');

      fibers.forEach((fiber) => {
        const fiberDocRef = doc(fibersCollection);
        batch.set(fiberDocRef, fiber);
      });
    }

    // Commit the batch
    await batch.commit();

    return fabricDocRef;
  }

  async updateFabric(
    userId: string,
    fabric: Partial<Fabric>,
    fibers: Partial<Fiber>[]
  ): Promise<any> {
    // Create a batch to handle fabric and fibers atomically
    const batch = writeBatch(this.fs);
    const fabricDocRef = doc(this.fs, `users/${userId}/fabrics/${fabric.id}`);
    batch.update(fabricDocRef, fabric);
    const fibersCollection = collection(fabricDocRef, 'fibers');

    // First, delete existing fibers to prevent duplicates
    const existingFibersQuery = query(fibersCollection);
    const existingFibersSnapshot = await getDocs(existingFibersQuery);
    existingFibersSnapshot.forEach((existingFiberDoc) => {
      batch.delete(existingFiberDoc.ref);
    });

    // Add new fibers
    if (fibers && fibers.length > 0) {
      fibers.forEach((fiber) => {
        const fiberDocRef = doc(fibersCollection);
        batch.set(fiberDocRef, fiber);
      });
    }

    // Commit the batch
    await batch.commit();

    return fabricDocRef;
  }

  async deleteFabric(userId: string, fabricId: string): Promise<void> {
    const batch = writeBatch(this.fs);
    const fabricDocRef = doc(this.fs, `users/${userId}/fabrics/${fabricId}`);
    const fibersCollection = collection(fabricDocRef, 'fibers');
    const fibersQuery = query(fibersCollection);
    const fibersSnapshot = await getDocs(fibersQuery);

    // Add deletion of all fiber documents to the batch
    fibersSnapshot.forEach((fiberDoc) => {
      batch.delete(fiberDoc.ref);
    });

    // Add deletion of the fabric document to the batch
    batch.delete(fabricDocRef);

    // Commit the batch to delete both fabric and its fibers
    await batch.commit();
  }
}
