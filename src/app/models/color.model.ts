export class Color {
  constructor(init?: Partial<Color>) {
    Object.assign(this, init);
  }
  id: string;
  name: string;
  active: boolean = true;
}
