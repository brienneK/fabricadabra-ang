import { Routes } from '@angular/router';
import { StashComponent } from './components/stash/stash.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'stash',
        component: StashComponent
    }
];
