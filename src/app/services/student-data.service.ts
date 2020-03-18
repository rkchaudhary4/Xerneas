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
import { finalize, tap, first} from 'rxjs/internal/operators';
import { Papa } from 'ngx-papaparse';
import { Student } from '../models/student';
import { TaStudent, TaManager, ManagerStudent } from '../models/data';
import { LoggedUserService } from './logged-user.service';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { User } from 'src/app/models/user';

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

  public taManager = (id: string): AngularFirestoreDocument<TaManager> => this.afs.doc(`users/${id}/data/manager`);

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
      .collection('students', ref => ref.orderBy('id'))
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
                id: stu.id,
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

  assignStoM(student: string, manage: string) {
    let sName;
    this.studentRef(student).valueChanges().pipe(first()).subscribe(res => {
      sName = res.name;
      this.managerRef(manage, student).set({
        uid: student,
        name: sName,
      })
    });
    this.studentRef(student).update({
      manager: manage
    });
  }

  assignStoTa(student: string, ta: string) {
    this.taRef(ta, student).set({
      uid: student,
      comments: '',
      fields: [],
      time: Timestamp.now(),
    })
    this.studentRef(student).valueChanges().pipe(first()).subscribe((data: Student) => {
      this.studentRef(student).update({
        tas: [...data.tas, ta]
      })
    })
  }

  assignTatoM(manager: string, ta: string) {
    let Mname;
    this.loginService.userRef(manager).valueChanges().pipe(first()).subscribe((res: User) => {
      Mname = res.displayName;
      this.taManager(ta).set({
        uid: manager,
        name: Mname
      })
    });
  }

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    private papa: Papa,
    private loginService: LoggedUserService,
  ) {}
}
