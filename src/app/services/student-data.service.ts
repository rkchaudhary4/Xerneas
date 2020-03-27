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
import { finalize, tap } from 'rxjs/internal/operators';
import { Papa } from 'ngx-papaparse';
import { Student } from '../models/student';
import { TaStudent, ManagerStudent } from '../models/data';

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

  public managerRef = (id: string, studentId: string): AngularFirestoreDocument<ManagerStudent> =>
    this.afs.doc(`users/${id}/data/${studentId}`);

  uploadData(file: File) {
    if (file.type.split('/')[1] !== 'csv') {
      console.log(file.type);
      this.snackbar.open('Please upload a CSV file', '', {
        duration: 2000
      });
      return;
    }
    const path = `/data.csv`;

    this.task = this.storage.upload(path, file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          this.snackbar.open('File Uploaded Successfuly', '', {
            duration: 2000
          });
        }
      }),
      finalize(() => {
        this.downloadURL = this.storage.ref(path).getDownloadURL();
      })
    );
  }

  pause() {
    if (this.task) {
      this.task.pause();
    }
  }

  cancel() {
    if (this.task) {
      this.task.cancel();
    }
  }

  resume() {
    if (this.task) {
      this.task.resume();
    }
  }

  getData() {
    return this.afs
      .collection('students', ref => ref.orderBy('uid'))
      .valueChanges();
  }

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
                name: stu.Name,
                comments: [],
                fields: [],
                manager: '',
                tas: []
              });
            });
            console.log('Data Uploaded');
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
