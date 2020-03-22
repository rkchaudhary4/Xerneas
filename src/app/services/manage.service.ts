import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Student } from '../models/student';
import { TaStudent, ManagerStudent } from '../models/data';
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

public managerRef = (id: string, studentId: string): AngularFirestoreDocument<ManagerStudent> =>
  this.afs.doc(`users/${id}/data/${studentId}`);

  assignStoM(student: string, manage: string) {
    let sName;
    this.studentRef(student).valueChanges().pipe(first()).subscribe(res => {
      sName = res.name;
      this.managerRef(manage, student).set({
        uid: student,
        name: sName,
        submitted: false
      })
    });
    this.studentRef(student).update({
      manager: manage
    });
  }

  assignStoTa(student: string, ta: string) {
    let sName;
    this.studentRef(student).valueChanges().pipe(first()).subscribe(res => {
      sName = res.name
      this.taRef(ta, student).set({
      uid: student,
      comments: '',
      fields: [],
      time: Timestamp.now(),
      name: sName
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
