export class Fabric {
  constructor(init?: Partial<Fabric>) {
    Object.assign(this, init);
  }
  id: string;
  fiber: string;
  material: string;
  pattern: string;
  color: string;
  width: number;
  length: number;
  source: string;
  scrap: boolean;
  public get yardage(): number {
    return Math.floor(this.length / 36);
  }
  public get inches(): number {
    return this.length % 36;
  }
}
