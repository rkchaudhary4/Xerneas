import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class TaStudent {
  public uid: string;
  public time: Timestamp;
  public comments: {field: string, comment: string}[];

  constructor( student ) {
    this.uid = student.uid,
    this.comments = student.comments,
    this.time = student.time;
  }
}
