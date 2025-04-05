export class Material {
  constructor(init?: Partial<Material>) {
    Object.assign(this, init);
  }
  id: string;
  name: string;
  active: boolean = true;
}
