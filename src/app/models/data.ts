import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class TaStudent {
  public uid: string;
  public comments: string;
  public fields: Array<string>;
  public time: Timestamp;
  public name: string;

  constructor( student ) {
    this.uid = student.uid,
    this.comments = student.comments,
    this.fields = student.fields,
    this.time = student.time
  }
}

export class ManagerStudent {
  public uid: string;
  public name: string;
  public submitted: boolean;
}

export class ManagerTa {
  public uids: Array<string>
}
