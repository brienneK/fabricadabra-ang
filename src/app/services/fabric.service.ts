import { inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { Fabric } from '../models/fabric.model';

@Injectable({
  providedIn: 'root',
})
export class FabricService {
  fs = inject(getFirestore);

  fabrics = signal<Fabric[]>([]);

  getFabrics(userId: string): void {
    const c = collection(this.fs, `users/${userId}/fabrics`);
    const q = query(c, orderBy('length', 'desc'));
    onSnapshot(q, (snapshot) => {
      const fabrics = [
        ...snapshot.docs.map(
          (doc) => new Fabric({ id: doc.id, ...doc.data() })
        ),
      ];
      this.fabrics.set(fabrics);
    });
  }

  async addFabric(userId: string, fabric: Partial<Fabric>): Promise<any> {
    const c = collection(this.fs, `users/${userId}/fabrics`);
    return await addDoc(c, fabric);
  }

  async updateFabric(userId: string, fabric: Partial<Fabric>): Promise<any> {
    const d = doc(this.fs, `users/${userId}/fabrics/${fabric.id}`);
    return await updateDoc(d, fabric);
  }

  async deleteFabric(userId: string, fabricId: string): Promise<any> {
    const d = doc(this.fs, `users/${userId}/fabrics/${fabricId}`);
    return await deleteDoc(d);
  }
}
