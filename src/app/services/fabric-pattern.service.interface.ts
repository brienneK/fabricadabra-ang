import { FabricPattern } from '@models/fabric-pattern.model';

export interface FabricPatternServiceInterface {
  getUserFabricPatterns(userId: string): void;
  addFabricPattern(
    userId: string,
    fabricPattern: Partial<FabricPattern>
  ): Promise<any>;
  updateFabricPattern(
    userId: string,
    fabricPatternId: string,
    fabricPattern: Partial<FabricPattern>
  ): Promise<void>;
  deleteFabricPattern(userId: string, fabricPatternId: string): Promise<void>;
}
