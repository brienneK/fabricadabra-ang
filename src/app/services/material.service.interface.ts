import { Material } from '@models/material.model';

export interface MaterialServiceInterface {
  getUserMaterials(userId: string): void;
  addMaterial(userId: string, material: Partial<Material>): Promise<any>;
  updateMaterial(
    userId: string,
    materialId: string,
    material: Partial<Material>
  ): Promise<void>;
  deleteMaterial(userId: string, materialId: string): Promise<void>;
}
