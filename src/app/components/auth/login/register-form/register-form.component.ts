import {
  Component,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
// import { LoadingService } from '@shared/loading/loading.service';
import { getAnalytics, logEvent } from 'firebase/analytics';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
} from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
// import { passwordMatchValidator } from '../password-match-validator';

@Component({
  selector: 'app-register-form',
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  protected readonly auth = inject(getAuth);
  // protected readonly loading = inject(LoadingService);
  protected readonly router = inject(Router);
  protected readonly fb = inject(FormBuilder);
  protected readonly snackbar = inject(MatSnackBar);
  protected readonly analytics = inject(getAnalytics);
  protected readonly functions = inject(getFunctions);

  hidePassword = model<boolean>(true);
  hideConfirmPassword = model<boolean>(true);

  registerForm = this.fb.group(
    {
      displayName: ['', Validators.required],
      // Validators.email gives the error before a domain is entered or after the period but before the domain extension (i.e. test@ or test@test.) but not when the entered value is test@test
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }
    // { validators: passwordMatchValidator() }
  );

  toggleHidePassword() {
    this.hidePassword.update((h) => !h);
  }

  toggleHideConfirmPassword() {
    this.hideConfirmPassword.update((h) => !h);
  }

  get r() {
    return this.registerForm.controls;
  }

  async register() {
    const displayName = this.registerForm.value.displayName;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    // this.loading.loadingOn();
    const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
    if (signInMethods.length > 0 && signInMethods.includes('password')) {
      // this.loading.loadingOff();
      this.snackbar.open(
        'Account already exists for this email address',
        'Close'
      );
      return;
    } else {
      await createUserWithEmailAndPassword(this.auth, email, password)
        .then(() => {
          this.router.navigateByUrl('/stash');
        })
        .catch((error) => {
          this.snackbar.open(error.message, 'Close');
        })
        .finally(() => {
          // this.loading.loadingOff();
        });
    }
  }
}
