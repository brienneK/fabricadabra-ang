import { signal } from '@angular/core';
import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { Fabric } from '@models/fabric.model';
import { FabricService } from '@services/fabric.service';
import { LoadingService } from '@shared/loading/loading.service';
import { StashStore } from '@store/stash.store';
import { UserStore } from '@store/user.store';

@Component({
  selector: 'app-edit-fabric',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    MatCheckbox,
  ],
  templateUrl: './edit-fabric.component.html',
  styleUrl: './edit-fabric.component.scss',
})
export class EditFabricComponent {
  protected readonly fb = inject(FormBuilder);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly loading = inject(LoadingService);
  protected readonly stashStore = inject(StashStore);
  protected readonly fabricService = inject(FabricService);
  protected readonly userStore = inject(UserStore);

  fabric = signal<Fabric>(null);

  editFabricForm = this.fb.group({
    fiber: ['', Validators.required],
    material: [''],
    pattern: [''],
    color: [''],
    width: [0],
    length: [0],
    scrap: [false],
    source: [''],
    price: [0],
  });

  ngOnInit(): void {
    const fabric = this.route.snapshot.data.fabric;
    if (fabric) {
      this.fabric.set(fabric);
      this.editFabricForm.patchValue({
        fiber: fabric.fiber,
        material: fabric.material,
        pattern: fabric.pattern,
        color: fabric.color,
        width: fabric.width,
        length: fabric.length,
        scrap: fabric.scrap,
        source: fabric.source,
        price: fabric.price,
      });
    } else {
      console.log('Route data:', this.route.snapshot.data);
      const fabric = this.route.snapshot.data.fabric;
      console.log('Fabric object:', fabric);
    }
  }

  get f() {
    return this.editFabricForm.controls;
  }

  onSubmit(): void {
    this.editFabricForm.disable();
    const userId = this.userStore.user().id;
    const fabricId = this.fabric().id;
    const val = this.editFabricForm.value;
    const changes: Partial<Fabric> = {
      id: fabricId,
      fiber: val.fiber,
      material: val.material,
      pattern: val.pattern,
      color: val.color,
      width: val.width,
      length: val.length,
      scrap: val.scrap,
      source: val.source,
      price: val.price,
    };
    this.fabricService
      .updateFabric(userId, changes)
      .then(() => {
        this.router.navigate(['/stash']);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  onCancel(): void {
    this.router.navigate(['/stash']);
  }
}
