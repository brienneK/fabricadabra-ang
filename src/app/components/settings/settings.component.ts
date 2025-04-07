import { Component } from '@angular/core';
import { ColorsComponent } from '@components/colors/colors.component';
import { FabricPatternsComponent } from '@components/fabric-patterns/fabric-patterns.component';
import { MaterialsComponent } from '@components/materials/materials.component';
import { SourcesComponent } from '@components/sources/sources.component';

@Component({
  selector: 'app-settings',
  imports: [
    MaterialsComponent,
    FabricPatternsComponent,
    ColorsComponent,
    SourcesComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
