import { Injectable, inject } from '@angular/core';
import { Color } from '@models/color.model';
import { ColorStore } from '@store/color.store';
import { SortingService } from './sorting.service';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  protected readonly colorStore = inject(ColorStore);
  protected readonly fs = inject(getFirestore);
  protected readonly sorter = inject(SortingService);

  getUserColors(userId: string): void {
    const c = collection(this.fs, `users/${userId}/colors`);
    const q = query(c, orderBy('name', 'asc'));
    onSnapshot(q, (querySnap) => {
      const colors = [
        ...querySnap.docs.map(
          (doc) => new Color({ ...doc.data(), id: doc.id })
        ),
      ];
      this.colorStore.setUserColors(colors);
    });
  }

  async addColor(userId: string, color: Partial<Color>): Promise<any> {
    const c = collection(this.fs, `users/${userId}/colors`);
    const q = query(c, where('name', '==', color.name));
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await addDoc(c, color);
      } else {
        throw new Error('Color already exists');
      }
    });
  }

  async updateColor(
    userId: string,
    colorId: string,
    changes: Partial<Color>
  ): Promise<any> {
    const c = collection(this.fs, `users/${userId}/colors/`);
    const q = query(
      c,
      where('name', '==', changes.name),
      where(documentId(), '!=', colorId)
    );
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await updateDoc(
          doc(this.fs, `users/${userId}/colors/${colorId}`),
          changes
        );
      } else {
        throw new Error('Color already exists');
      }
    });
  }

  async deleteColor(userId: string, colorId: string): Promise<any> {
    const c = collection(this.fs, `users/${userId}/colors`);
    const q = query(c, where(documentId(), '==', colorId));
    return await getDocs(q).then(async (querySnap) => {
      if (!querySnap.empty) {
        return await deleteDoc(doc(c, colorId));
      } else {
        throw new Error(
          'This color is assigned to one or more fabrics and cannot be deleted.'
        );
      }
    });
  }
}
