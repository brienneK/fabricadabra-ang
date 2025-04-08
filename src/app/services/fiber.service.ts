import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Fiber } from '@models/fiber.model';
import { FiberStore } from '@store/fiber.store';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { SortingService } from './sorting.service';

@Injectable({
  providedIn: 'root',
})
export class FiberService {
  protected readonly fs = inject(getFirestore);
  protected readonly fiberStore = inject(FiberStore);
  protected readonly sorter = inject(SortingService);

  getFibers(userId: string, fabricId: string): void {
    const c = collection(this.fs, `users/${userId}/fabrics/${fabricId}/fibers`);
    const q = query(c, orderBy('percentage', 'desc'));
    onSnapshot(q, (snapshot) => {
      const fibers = [
        ...snapshot.docs.map((doc) => new Fiber({ id: doc.id, ...doc.data() })),
      ];
      this.fiberStore.setUserFibers(fibers);
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

  getUserFibers(userId: string): void {
    const c = collection(this.fs, `users/${userId}/fibers`);
    const q = query(c, orderBy('name', 'asc'));
    onSnapshot(q, (querySnap) => {
      const fibers = [
        ...querySnap.docs.map(
          (doc) => new Fiber({ ...doc.data(), id: doc.id })
        ),
      ];
      this.fiberStore.setUserFibers(fibers);
    });
  }

  async addUserFiber(userId: string, fiber: Partial<Fiber>): Promise<any> {
    const c = collection(this.fs, `users/${userId}/fibers`);
    const q = query(c, where('name', '==', fiber.fiber));
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await addDoc(c, fiber);
      } else {
        throw new Error('Fiber already exists');
      }
    });
  }

  async updateUserFiber(
    userId: string,
    fiberId: string,
    changes: Partial<Fiber>
  ): Promise<any> {
    const c = collection(this.fs, `users/${userId}/fibers/`);
    const q = query(
      c,
      where('name', '==', changes.fiber),
      where(documentId(), '!=', fiberId)
    );
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await updateDoc(
          doc(this.fs, `users/${userId}/fibers/${fiberId}`),
          changes
        );
      } else {
        throw new Error('Fiber already exists');
      }
    });
  }

  async deleteUserFiber(userId: string, fiberId: string): Promise<any> {
    const c = collection(this.fs, `users/${userId}/fibers`);
    const q = query(c, where(documentId(), '==', fiberId));
    return await getDocs(q).then(async (querySnap) => {
      if (!querySnap.empty) {
        return await deleteDoc(doc(c, fiberId));
      } else {
        throw new Error(
          'This fiber is assigned to one or more fabrics and cannot be deleted.'
        );
      }
    });
  }
}
