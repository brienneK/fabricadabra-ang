import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAnalytics, logEvent } from 'firebase/analytics';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { User } from '@models/user.model';
import { FabricService } from './fabric.service';
import { UserStore } from '@store/user.store';
import { MaterialService } from './material.service';
import { FabricPatternService } from './fabric-pattern.service';
import { SourceService } from './source.service';
import { ColorService } from './color.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  userStore = inject(UserStore);
  fs = inject(getFirestore);
  auth = inject(getAuth);
  analytics = inject(getAnalytics);
  router = inject(Router);
  fabricService = inject(FabricService);
  materialService = inject(MaterialService);
  fabricPatternService = inject(FabricPatternService);
  colorService = inject(ColorService);
  sourceService = inject(SourceService);

  constructor() {
    setPersistence(this.auth, browserLocalPersistence)
      .then(async () => {
        this.auth.onAuthStateChanged((firebaseUser) => {
          if (!!firebaseUser) {
            this.getUserDetails(firebaseUser.uid).then(
              async (userData: Partial<User>) => {
                const user = new User({
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  ...userData,
                });
                this.userStore.setUser(user);
                this.materialService.getUserMaterials(user.id);
                this.fabricPatternService.getUserFabricPatterns(user.id);
                this.colorService.getUserColors(user.id);
                this.sourceService.getUserSources(user.id);
                await this.fabricService.getFabrics(user.id).then(() => {
                  this.router.navigateByUrl('/stash');
                });
              }
            );
            return true;
          } else {
            this.userStore.clearUser();
            return false;
          }
        });
      })
      .catch((error) => {
        console.error('Error setting persistence', error);
        logEvent(this.analytics, 'error', { message: error.message });
      });
  }

  async getUserDetails(userId: string): Promise<User | null> {
    const docRef = doc(this.fs, `users/${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return new User(docSnap.data());
    }
    // @TODO Create a batch to handle new user creation.
    return null;
  }

  async updateUser(changes: Partial<User>): Promise<void> {
    const userId = this.userStore.user().id;
    const docRef = doc(this.fs, `users/${userId}`);
    return await setDoc(docRef, changes, { merge: true }).then(() => {
      this.userStore.updateUser(changes);
    });
  }

  logout(): void {
    this.auth.signOut().finally(() => this.router.navigateByUrl('/'));
  }
}
