export class User {
  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
  id: string;
  userName: string;
  email: string;
}
