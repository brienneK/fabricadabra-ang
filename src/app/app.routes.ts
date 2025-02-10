import { Routes } from '@angular/router';
import { StashComponent } from './components/stash/stash.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StatsComponent } from './components/stats/stats.component';
import { AddFabricComponent } from './components/stash/add-fabric/add-fabric.component';
import { LoginComponent } from '@components/auth/login/login.component';

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
  },
  {
    path: 'stash',
    title: 'Stash',
    component: StashComponent,
  },
  {
    path: 'add-fabric',
    title: 'Add Fabric',
    component: AddFabricComponent,
  },
  {
    path: 'stats',
    title: 'Stats',
    component: StatsComponent,
  },
  {
    path: 'settings',
    title: 'Settings',
    component: SettingsComponent,
  },
];
