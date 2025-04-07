import { Injectable, inject } from '@angular/core';
import { Source } from '@models/source.model';
import { SourceServiceInterface } from './source.service.interfac';
import { SourceStore } from '@store/source.store';
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
export class SourceService {
  protected readonly sourceStore = inject(SourceStore);
  protected readonly fs = inject(getFirestore);
  protected readonly sorter = inject(SortingService);

  getUserSources(userId: string): void {
    const c = collection(this.fs, `users/${userId}/sources`);
    const q = query(c, orderBy('name', 'asc'));
    onSnapshot(q, (querySnap) => {
      const sources = [
        ...querySnap.docs.map(
          (doc) => new Source({ ...doc.data(), id: doc.id })
        ),
      ];
      this.sourceStore.setUserSources(sources);
    });
  }

  async addSource(userId: string, source: Partial<Source>): Promise<any> {
    const c = collection(this.fs, `users/${userId}/sources`);
    const q = query(c, where('name', '==', source.name));
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await addDoc(c, source);
      } else {
        throw new Error('Source already exists');
      }
    });
  }

  async updateSource(
    userId: string,
    sourceId: string,
    changes: Partial<Source>
  ): Promise<any> {
    const c = collection(this.fs, `users/${userId}/sources/`);
    const q = query(
      c,
      where('name', '==', changes.name),
      where(documentId(), '!=', sourceId)
    );
    return await getDocs(q).then(async (querySnap) => {
      if (querySnap.empty) {
        return await updateDoc(
          doc(this.fs, `users/${userId}/sources/${sourceId}`),
          changes
        );
      } else {
        throw new Error('Source already exists');
      }
    });
  }

  async deleteSource(userId: string, sourceId: string): Promise<any> {
    const c = collection(this.fs, `users/${userId}/sources`);
    const q = query(c, where(documentId(), '==', sourceId));
    return await getDocs(q).then(async (querySnap) => {
      if (!querySnap.empty) {
        return await deleteDoc(doc(c, sourceId));
      } else {
        throw new Error(
          'This source is assigned to one or more fabrics and cannot be deleted.'
        );
      }
    });
  }
}
