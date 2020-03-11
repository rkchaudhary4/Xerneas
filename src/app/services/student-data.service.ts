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
import { finalize, tap, switchMap } from 'rxjs/internal/operators';
import { Papa } from 'ngx-papaparse';
import { Student } from '../models/student';
import { User } from '../models';
import { ManagerData } from '../models/data';

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

  public dataRef(id: string) {
    return this.afs.doc(`users/${id}/data/data`);
  }

  uploadData(file: File) {
    if (file.type.split('/')[1] !== 'csv') {
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
        if( snap.bytesTransferred === snap.totalBytes) {
          this.snackbar.open('File Uploaded Successfuly', '', {
            duration: 2000
          })
        }
      }),
      finalize(() => {
        this.downloadURL = this.storage.ref(path).getDownloadURL();
      })
    );
  }

  pause(){
    if( this.task ) {
      this.task.pause();
    }
  }

  cancel() {
    if( this.task ) {
      this.task.cancel();
    }
  }

  resume() {
    if( this.task ) {
    this.task.resume();
    }
  }

  getData() {
    return this.afs.collection('students', ref => ref.orderBy('id')).valueChanges();
  }

  updateData(){
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
                  id: stu.id,
                  name: stu.Name,
                  manager: '',
                  ta: [],
                  comments: []
                })
              })
              console.log('Data Uploaded');
            }
          });
    })
  }

  assignManager(student: string, manage: string) {
    // this.studentRef(student).update({
      // manager: manage
    // });

    const ref = this.dataRef(manage);
    ref.get().subscribe(res => {
      console.log(res.exists);
    })
    // ref.valueChanges().subscribe(res => console.log(res));
  }

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    private papa: Papa
  ) {}
}
