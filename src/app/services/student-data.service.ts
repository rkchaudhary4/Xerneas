import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
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
    this.afs.doc(`students/${id}`)

  public taRef = (id: string, studentId: string): AngularFirestoreDocument<TaStudent> =>
    this.afs.doc(`users/${id}/data/${studentId}`)

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
          complete: result => {
            result.data.forEach(stu => {
              this.studentRef(stu['Application Ref. No.'].split('\\')[3]).set({
                uid: stu['Application Ref. No.'].split('\\')[3],
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
    private papa: Papa
  ) {}
}
