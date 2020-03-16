import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class TaStudent {
  public uid: string;
  public comments: string;
  public fields: Array<string>;
  public time: Timestamp;

  constructor( student ) {
    this.uid = student.uid,
    this.comments = student.comments,
    this.fields = student.fields,
    this.time = student.time
  }
}

export class TaManager {
  public uid: string;
  public name: string;

  constructor( manager) {
    this.uid = manager.uid,
    this.name = manager.displayName
  }
}
