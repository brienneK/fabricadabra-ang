export class Fabric {
  constructor(init?: Partial<Fabric>) {
    Object.assign(this, init);
  }
  id: string;
  fiber: string;
  material: string;
  pattern: string;
  color: string;
  source: string;
  width: number;
  length: number;
  scrap: boolean;
  public get yardage(): number {
    return Math.floor(this.length / 36);
  }
  public get inches(): number {
    return this.length % 36;
  }
}
