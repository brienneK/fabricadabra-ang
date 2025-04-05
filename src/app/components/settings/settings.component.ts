import { Component } from '@angular/core';
import { MaterialsComponent } from '@components/materials/materials.component';

@Component({
  selector: 'app-settings',
  imports: [MaterialsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
