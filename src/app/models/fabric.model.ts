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
  lengthType: 'yd.' | 'in.';
  scrap: boolean;
}
