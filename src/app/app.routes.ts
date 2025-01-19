import { Routes } from '@angular/router';
import { StashComponent } from './components/stash/stash.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StatsComponent } from './components/stats/stats.component';
import { AddFabricComponent } from './components/stash/add-fabric/add-fabric.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'stash',
    component: StashComponent,
  },
  {
    path: 'add-fabric',
    component: AddFabricComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];
