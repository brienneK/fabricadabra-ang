import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stash',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './stash.component.html',
  styleUrl: './stash.component.css'
})
export class StashComponent {

}
