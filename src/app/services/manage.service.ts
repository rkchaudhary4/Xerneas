import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Student } from '../models/student';
import { TaStudent } from '../models/data';
import { first } from 'rxjs/internal/operators';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class ManageService {
  public studentRef = (id: string): AngularFirestoreDocument<Student> =>
  this.afs.doc(`students/${id}`);

public taRef = (id: string, studentId: string): AngularFirestoreDocument<TaStudent> =>
  this.afs.doc(`users/${id}/data/${studentId}`);

  assignStoM(student: string, manage: string) {
    this.studentRef(student).update({
      manager: manage
    });
  }

  assignStoTa(student: string, ta: string) {
    this.studentRef(student).valueChanges().pipe(first()).subscribe(res => {
      this.taRef(ta, student).set({
      uid: student,
      comments: [],
      time: Timestamp.now(),
    })})
    this.studentRef(student).valueChanges().pipe(first()).subscribe((data: Student) => {
      this.studentRef(student).update({
        tas: [...data.tas, ta]
      })
    })
  }

  assignMtoTa(manage: string, ta: string) {
    const userRef = this.afs.doc(`users/${ta}`);
    userRef.update({
      manager: manage
    })
  }

  constructor(
    private afs: AngularFirestore,
  ) { }
}
