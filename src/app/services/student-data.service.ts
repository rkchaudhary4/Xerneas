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
import { finalize, tap, first } from 'rxjs/internal/operators';
import { Papa } from 'ngx-papaparse';
import { Student } from '../models/student';
import { ManagerData, TaData, TaStudent } from '../models/data';
import { LoggedUserService } from './logged-user.service';
import { Router } from '@angular/router';

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

  public managerRef = (id: string): AngularFirestoreDocument<ManagerData> => {
    return this.afs.doc(`users/${id}/data/data`);
  };

  public taRef = (id: string): AngularFirestoreDocument<TaData> =>
    this.afs.doc(`users/${id}/data/data`);

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
                manager: '',
                ta: [],
                comments: []
              });
            });
            console.log('Data Uploaded');
          }
        });
      });
  }

  assignMtoT(manage: string, ta: string) {
    this.loginService.checkLevelById('Manager', manage).subscribe(isManager => {
      if (!isManager) {
        console.log('Not manager');
        return;
      } else {
        this.loginService
          .checkLevelById('Teaching Assistant (TA)', ta)
          .subscribe(isTa => {
            if (!isTa) {
              console.log('Not TA');
              return;
            } else {
              this.taRef(ta)
                .get()
                .subscribe(res => {
                  if (!res.exists) {
                    this.taRef(ta).set({
                      manager: manage,
                      students: []
                    });
                  } else {
                    this.taRef(ta).update({
                      manager: manage
                    });
                  }
                });
              this.managerRef(manage)
                .get()
                .subscribe(res => {
                  if (!res.exists) {
                    this.managerRef(manage).set({
                      tas: [ta],
                      students: []
                    });
                  } else {
                    const ref = this.managerRef(manage)
                      .valueChanges()
                      .pipe(first());
                    ref.subscribe(data => {
                      this.managerRef(manage).update({
                        tas: [...data.tas, ta]
                      });
                    });
                  }
                });
            }
          });
      }
    });
  }

  assignStoM(manage: string, student: string) {
    this.managerRef(manage).get().subscribe(res => {
      if( !res.exists ) {
        this.managerRef(manage).set({
          students: [student],
          tas: []
        })
      } else {
        const ref = this.managerRef(manage).valueChanges().pipe(first());
        ref.subscribe(data => {
          this.managerRef(manage).update({
            students: [...data.students, student]
          })
        })
      }
    })
  }

  assignStoTa(ta: string, student: string) {
    const stu = {uid: student, comments: ''};
    const s = new TaStudent(stu)
    this.taRef(ta).get().subscribe(res => {
      if( !res.exists ) {
        this.taRef(ta).set({
          manager: '',
          students: [s]
        })
      } else {
        const ref = this.taRef(ta).valueChanges().pipe(first());
        ref.subscribe(data => {
          this.taRef(ta).update({
            students: [...data.students, s]
          })
        })
      }
    })
  }

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    private papa: Papa,
    private loginService: LoggedUserService,
  ) {}
}
