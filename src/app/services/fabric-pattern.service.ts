import { Injectable, inject } from '@angular/core';
import { FabricPattern } from '@models/fabric-pattern.model';
import { FabricPatternStore } from '@store/fabric-pattern.store';
import { FabricPatternServiceInterface } from './fabric-pattern.service.interface';
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
export class FabricPatternService {
  protected readonly fabricPatternStore = inject(FabricPatternStore);
  protected readonly fs = inject(getFirestore);
  protected readonly sorter = inject(SortingService);

  getUserFabricPatterns(userId: string): void {
    const c = collection(this.fs, `users/${userId}/fabricPatterns`);
    const q = query(c, orderBy('name', 'asc'));
    onSnapshot(q, (querySnap) => {
      const fabricPatterns = [
        ...querySnap.docs.map(
          (doc) => new FabricPattern({ ...doc.data(), id: doc.id })
        ),
      ];
      this.fabricPatternStore.setUserFabricPatterns(fabricPatterns);
    });
  }

  async addFabricPattern(
    userId: string,
    fabricPattern: Partial<FabricPattern>
  ): Promise<any> {
    const c = collection(this.fs, `users/${userId}/fabricPatterns`);
    const q = query(c, where('name', '==', fabricPattern.name));
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await addDoc(c, fabricPattern);
      } else {
        throw new Error('Fabric pattern already exists');
      }
    });
  }

  async updateFabricPattern(
    userId: string,
    fabricPatternId: string,
    changes: Partial<FabricPattern>
  ): Promise<any> {
    const c = collection(this.fs, `users/${userId}/fabricPatterns/`);
    const q = query(
      c,
      where('name', '==', changes.name),
      where(documentId(), '!=', fabricPatternId)
    );
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await updateDoc(
          doc(this.fs, `users/${userId}/fabricPatterns/${fabricPatternId}`),
          changes
        );
      } else {
        throw new Error('Fabric pattern already exists');
      }
    });
  }

  async deleteFabricPattern(
    userId: string,
    fabricPatternId: string
  ): Promise<any> {
    const c = collection(this.fs, `users/${userId}/fabricPatterns`);
    const q = query(c, where(documentId(), '==', fabricPatternId));
    return await getDocs(q).then(async (querySnap) => {
      if (!querySnap.empty) {
        return await deleteDoc(doc(c, fabricPatternId));
      } else {
        throw new Error(
          'This fabric pattern is assigned to one or more fabrics and cannot be deleted.'
        );
      }
    });
  }
}
