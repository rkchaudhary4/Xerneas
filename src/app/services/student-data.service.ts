import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Papa } from 'ngx-papaparse';
import { Student } from '../models/student';
import { TaStudent } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class StudentDataService {
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;

  public studentRef = (id: string): AngularFirestoreDocument<Student> =>
    this.afs.doc(`students/${id}`);

  public taRef = (id: string, studentId: string): AngularFirestoreDocument<TaStudent> =>
    this.afs.doc(`users/${id}/data/${studentId}`);

  updateData() {
    const path = `/data.csv`;
    this.storage
      .ref(path)
      .getDownloadURL()
      .subscribe(res => {
        this.papa.parse(res, {
          download: true,
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: result => {
            result.data.forEach(stu => {
              this.studentRef(stu.id).set({
                uid: stu.id,
                comments: [],
                manager: '',
                tas: []
              });
            });
          }
        });
      });
  }

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    private papa: Papa
  ) {}
}
