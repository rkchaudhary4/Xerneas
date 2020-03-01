export interface IUser {
  uid: string;
  displayName: string;
  email: string | null;
  role: string;
  approved: boolean
}

export class User implements IUser {
  public role: string;
  uid: string;
  public displayName: string;
  public email: string ;
  public approved: boolean;

  constructor(localUser) {
    this.role = localUser.role;
    this.uid = localUser.uid;
    this.displayName = localUser.displayName;
    this.email = localUser.email;
    this.approved = localUser.approved;
  }
}
