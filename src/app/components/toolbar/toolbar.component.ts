import { Component, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { UserService } from '@services/user.service';
import { MatMenuModule } from '@angular/material/menu';
import { UserStore } from '@store/user.store';
import { User } from '@models/user.model';

@Component({
  selector: 'app-toolbar',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  userStore = inject(UserStore);
  userService = inject(UserService);

  user: Signal<User> = this.userStore.user;
  isLoggedIn: Signal<boolean> = this.userStore.isLoggedIn;
  logout = () => this.userService.logout();
}
