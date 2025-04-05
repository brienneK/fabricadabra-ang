import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Fiber } from '@models/fiber.model';
import { FiberStore } from '@store/fiber.store';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  getFirestore,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FiberService {
  fs = inject(getFirestore);
  fiberStore = inject(FiberStore);

  getFibers(userId: string, fabricId: string): void {
    const c = collection(this.fs, `users/${userId}/fabrics/${fabricId}/fibers`);
    const q = query(c, orderBy('percentage', 'desc'));
    onSnapshot(q, (snapshot) => {
      const fibers = [
        ...snapshot.docs.map((doc) => new Fiber({ id: doc.id, ...doc.data() })),
      ];
      this.fiberStore.setFibers(fibers);
    });
  }

  async getFiber(
    userId: string,
    fabricId: string,
    fiberId: string
  ): Promise<any> {
    const d = doc(
      this.fs,
      `users/${userId}/fabrics/${fabricId}/fibers/${fiberId}`
    );
    const fiberDoc = await getDoc(d);
    if (!fiberDoc.exists()) {
      throw new Error('Fiber not found');
    }
    const fiber = new Fiber({ id: fiberDoc.id, ...fiberDoc.data() });
    return fiber;
  }

  async addFiber(
    userId: string,
    fabricId: string,
    fiber: Partial<Fiber>
  ): Promise<any> {
    const c = collection(this.fs, `users/${userId}/fabrics/${fabricId}/fibers`);
    return await addDoc(c, fiber);
  }

  async updateFiber(
    userId: string,
    fabricId: string,
    fiber: Partial<Fiber>
  ): Promise<any> {
    const d = doc(
      this.fs,
      `users/${userId}/fabrics/${fabricId}/fibers/${fiber.id}`
    );
    return await updateDoc(d, fiber);
  }

  async deleteFiber(
    userId: string,
    fabricId: string,
    fiberId: string
  ): Promise<any> {
    const d = doc(
      this.fs,
      `users/${userId}/fabrics/${fabricId}/fibers/${fiberId}`
    );
    return await deleteDoc(d);
  }
}
