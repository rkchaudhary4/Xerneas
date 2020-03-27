import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AngularFireUploadTask,
  AngularFireStorage
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, finalize } from 'rxjs/internal/operators';
import { LoggedUserService } from '../../services/logged-user.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {
  @Input() file: File;
  @Input() path: string;
  @Input() id?: string;
  @Output() done = new EventEmitter<boolean>(false);
  complete = false;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;
  name: string;
  cancelled = false;

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {
    this.name = this.file.name;
    this.task = this.storage.upload(this.path, this.file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          if (this.file.type.split('/')[0] === 'image') {
            this.snackbar.open('File Uploaded Successfuly', '', {
              duration: 2000
            });
          }
        }
      }),
      finalize(() => {
        if (this.file.type.split('/')[0] === 'image') {
          this.storage
            .ref(this.path)
            .getDownloadURL()
            .subscribe(res => {
              this.login.userRef(this.id).update({
                dpUrl: res
              });
            });
        }
        this.snapshot = null;
        this.done.emit(true);
        this.complete = true;
      })
    );
  }

  cancel() {
    this.task.cancel();
    this.cancelled = true;
  }

  isActive(snap) {
    return snap.state === 'running' && snap.bytesTransferred < snap.totalBytes;
  }

  constructor(
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    private login: LoggedUserService
  ) {}
}
