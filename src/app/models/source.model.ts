export class Source {
  constructor(init?: Partial<Source>) {
    Object.assign(this, init);
  }
  id: string;
  name: string;
  active: boolean = true;
}
