import { Fiber } from './fiber.model';

export class Fabric {
  constructor(init?: Partial<Fabric>) {
    Object.assign(this, init);
  }
  id: string;
  fibers: Fiber[];
  material: string;
  pattern: string;
  color: string;
  width: number;
  length: number;
  scrap: boolean;
  source: string;
  price: number;
  purchaseDate: Date;
  public get yardage(): number {
    return Math.floor(this.length / 36);
  }
  public get inches(): number {
    return this.length % 36;
  }
}
