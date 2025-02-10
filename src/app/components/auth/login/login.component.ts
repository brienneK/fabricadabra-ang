import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { UserStore } from '@store/user.store';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  auth = inject(getAuth);
  userStore = inject(UserStore);
  router = inject(Router);
  fb = inject(FormBuilder);

  get l() {
    return this.loginForm.controls;
  }

  get ca() {
    return this.createAccountForm.controls;
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  createAccountForm = this.fb.group({
    displayName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        // Validators.mustMatch(password),
      ],
    ],
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
