import { Injectable } from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { Student } from '../models/student';
import { TaStudent } from '../models/data';
import { first } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root',
})
export class ManageService {
  public studentRef = (id: string): AngularFirestoreDocument<Student> =>
    this.afs.doc(`students/${id}`)

  public taRef = (
    id: string,
    studentId: string
  ): AngularFirestoreDocument<TaStudent> =>
    this.afs.doc(`users/${id}/data/${studentId}`)

  assignStoM(student: string, manage: string) {
    this.studentRef(student).update({
      manager: manage,
    });
  }

  assignStoTa(student: string, tas: Array<string>) {
    tas.forEach((ta) => {
      this.taRef(ta, student)
        .get()
        .pipe(first())
        .subscribe((res) => {
          if (!res.exists) {
            this.taRef(ta, student).set({
              uid: student,
              comments: [],
              time: Timestamp.now(),
            });
          }
        });
    });
    this.studentRef(student)
      .valueChanges()
      .pipe(first())
      .subscribe((data: Student) => {
        const toRemove = [];
        data.tas.forEach(ta => {
          if ( !tas.includes(ta)){
            this.taRef(ta, data.uid).delete();
            toRemove.push(ta);
          }
        });
        data.tas = data.tas.filter(obj => !(toRemove.includes(obj)));
        tas.forEach((id) => {
          if (!data.tas.includes(id)) {
            data.tas.push(id);
          }
        });
        this.studentRef(student).update({
          tas: data.tas
        });
      });
  }

  assignMtoTa(manage: string, ta: string) {
    const userRef = this.afs.doc(`users/${ta}`);
    userRef.update({
      manager: manage,
    });
  }

  constructor(private afs: AngularFirestore) {}
}
