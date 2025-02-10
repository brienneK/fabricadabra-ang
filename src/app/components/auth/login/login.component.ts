import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserStore } from '@store/user.store';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  auth = inject(getAuth);
  userStore = inject(UserStore);
  router = inject(Router);
  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: [''],
    password: [''],
  });

  createAccountForm = this.fb.group({
    displayName: [''],
    email: [''],
    password: [''],
    confirmPassword: [''],
  });

  async login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    console.log('Logging in with', email, password);
    await signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigateByUrl('/stash');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error signing in: ${errorCode} - ${errorMessage}`);
      });
  }

  async createAccount() {
    const email = this.createAccountForm.value.email;
    const password = this.createAccountForm.value.password;
    const confirmPassword = this.createAccountForm.value.confirmPassword;
    const displayName = this.createAccountForm.value.displayName;
    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Creating account with', email, password, displayName);
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigateByUrl('/stash');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error creating account: ${errorCode} - ${errorMessage}`);
      });
  }
}
