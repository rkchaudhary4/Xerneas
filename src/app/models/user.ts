export interface IUser {
  uid: string;
  displayName: string;
  email: string | null;
}

export class User implements IUser {
  public role: string;
  public uid: string;
  public displayName: string;
  email: string | null;
  constructor(localUser) {
    this.role = localUser.role;
    this.uid = localUser.uid;
    this.displayName = localUser.displayName;
  }
}
