export class FabricPattern {
  constructor(init?: Partial<FabricPattern>) {
    Object.assign(this, init);
  }
  id: string;
  name: string;
  active: boolean = true;
}
