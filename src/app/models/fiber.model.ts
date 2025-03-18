export class Fiber {
  constructor(init?: Partial<Fiber>) {
    Object.assign(this, init);
  }
  id: string;
  fiber: string;
  percentage: number;
}
