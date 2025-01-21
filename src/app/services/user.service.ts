import { computed, inject, Injectable, signal } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = signal<User>(null);
  isLoggedIn = computed(() => !!this.user());

  fs = inject(getFirestore);
  auth = inject(getAuth);
  analytics = inject(getAnalytics);
  router = inject(Router);
  fabricService = inject(FabricService);

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
                this.user.set(user);
                this.fabricService.getFabrics(user.id);
              }
            );
            return true;
          } else {
            this.user.set(null);
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
    } else {
      // @TODO Create a batch to handle new user creation.
      setDoc(docRef, {
        userName: '',
      });
      // @TODO Add default options (fibers, materials, etc.) in other services.
      return null;
    }
  }

  async updateUser(changes: Partial<User>): Promise<void> {
    const docRef = doc(this.fs, `users/${this.user().id}`);
    return await setDoc(docRef, changes, { merge: true }).then(() => {
      this.user.update((u) => ({
        ...u,
        ...changes,
      }));
    });
  }

  logout(): void {
    this.auth.signOut().finally(() => this.router.navigateByUrl('/'));
  }
}
