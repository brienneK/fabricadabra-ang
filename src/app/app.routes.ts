import { Routes } from '@angular/router';
import { StashComponent } from './components/stash/stash.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StatsComponent } from './components/stats/stats.component';
import { AddFabricComponent } from './components/stash/add-fabric/add-fabric.component';
import { LoginComponent } from '@components/auth/login/login.component';
import { LoginFormComponent } from '@components/auth/login/login-form/login-form.component';
import { ForgotPasswordComponent } from '@components/auth/login/forgot-password/forgot-password.component';
import { RegisterFormComponent } from '@components/auth/login/register-form/register-form.component';
import { ResetPasswordComponent } from '@components/auth/login/reset-password/reset-password.component';
import { AccountComponent } from '@components/auth/account/account.component';
import { authGuard, loggedInGuard } from '@components/auth/guards.guard';
import { EditFabricComponent } from '@components/stash/edit-fabric/edit-fabric.component';
import { Fabric } from '@models/fabric.model';
import { editFabricResolver } from '@components/stash/edit-fabric/edit-fabric.resolver';
import { stashResolver } from '@components/stash/stash.resolver';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomeComponent,
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
    canActivate: [loggedInGuard],
    children: [
      { path: '', title: 'Login', component: LoginFormComponent },
      { path: 'register', title: 'Register', component: RegisterFormComponent },
      {
        path: 'forgot-password',
        title: 'Forgot Password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password',
        title: 'Reset Password',
        component: ResetPasswordComponent,
      },
    ],
  },
  {
    path: 'account',
    title: 'Account',
    component: AccountComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stash',
    title: 'Stash',
    component: StashComponent,
    resolve: { fabrics: stashResolver },
    canActivate: [authGuard],
  },
  {
    path: 'add-fabric',
    title: 'Add Fabric',
    component: AddFabricComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-fabric/:id',
    title: 'Edit Fabric',
    component: EditFabricComponent,
    resolve: { fabric: editFabricResolver },
    canActivate: [authGuard],
  },
  {
    path: 'stats',
    title: 'Stats',
    component: StatsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    title: 'Settings',
    component: SettingsComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
