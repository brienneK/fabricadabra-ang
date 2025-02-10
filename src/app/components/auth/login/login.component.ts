import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from '@store/user.store';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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

  async login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    console.log('Logging in with', email, password);
    await signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigateByUrl('/stash');
      })
      .catch((error) => {
        console.error('Error signing in', error);
      });
  }
}
