import { Injectable, inject } from '@angular/core';
import { Material } from '@models/material.model';
import { MaterialServiceInterface } from './material.service.interface';
import { MaterialStore } from '@store/material.store';
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
export class MaterialService {
  protected readonly materialStore = inject(MaterialStore);
  protected readonly fs = inject(getFirestore);
  protected readonly sorter = inject(SortingService);

  getUserMaterials(userId: string): void {
    const c = collection(this.fs, `users/${userId}/materials`);
    const q = query(c, orderBy('name', 'asc'));
    onSnapshot(q, (querySnap) => {
      const materials = [
        ...querySnap.docs.map(
          (doc) => new Material({ ...doc.data(), id: doc.id })
        ),
      ];
      this.materialStore.setUserMaterials(materials);
    });
  }

  async addMaterial(userId: string, material: Partial<Material>): Promise<any> {
    const c = collection(this.fs, `users/${userId}/materials`);
    const q = query(c, where('name', '==', material.name));
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await addDoc(c, material);
      } else {
        throw new Error('Material already exists');
      }
    });
  }

  async updateMaterial(
    userId: string,
    materialId: string,
    changes: Partial<Material>
  ): Promise<any> {
    const c = collection(this.fs, `users/${userId}/materials/`);
    const q = query(
      c,
      where('name', '==', changes.name),
      where(documentId(), '!=', materialId)
    );
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await updateDoc(
          doc(this.fs, `users/${userId}/materials/${materialId}`),
          changes
        );
      } else {
        throw new Error('Material already exists');
      }
    });
  }

  async deleteMaterial(userId: string, materialId: string): Promise<any> {
    const c = collection(this.fs, `users/${userId}/materials`);
    const q = query(c, where(documentId(), '==', materialId));
    return await getDocs(q).then(async (querySnap) => {
      if (!querySnap.empty) {
        return await deleteDoc(doc(c, materialId));
      } else {
        throw new Error(
          'This material is assigned to one or more fabrics and cannot be deleted.'
        );
      }
    });
  }
}
