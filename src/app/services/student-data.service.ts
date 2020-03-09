import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/internal/operators';
import { Papa, ParseResult } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class StudentDataService {
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    private papa: Papa
  ) {}

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
      finalize(() => {
        this.downloadURL = this.storage.ref(path).getDownloadURL();
        console.log('this.downloadURL');
      })
    );
  }

  getData() {
    const path = `/data.csv`;
    return new Promise(resolve => {
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
              resolve(result);
            }
          });
        });
    });
  }
}
