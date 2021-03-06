export interface IUser {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  dpUrl: string | null;
  approved: boolean;
}

export class User implements IUser {
  public role: string;
  uid: string;
  public displayName: string;
  public email: string ;
  public approved: boolean;
  public manager?: string;
  public dpUrl: string | null;

  constructor(localUser) {
    this.role = localUser.role;
    this.uid = localUser.uid;
    this.displayName = localUser.displayName;
    this.email = localUser.email;
    this.approved = localUser.approved;
    this.manager = localUser.manager;
  }
}
