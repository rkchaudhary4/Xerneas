import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AngularFireUploadTask,
  AngularFireStorage
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, finalize } from 'rxjs/internal/operators';
import { LoggedUserService } from '../../services/logged-user.service';
import { StudentDataService } from '../../services/student-data.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {
  @Input() file: File;
  @Input() path: string;
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
          this.done.emit(true);
          this.complete = true;
          this.snapshot = null;
          if (this.file.type.split('/')[1] === 'csv') {
            this.$data.updateData();
          }
        }
      }),
    );
  }

  cancel() {
    this.task.cancel();
    this.snapshot = null;
    this.done.emit(true);
    this.cancelled = true;
  }

  isActive(snap) {
    return snap.state === 'running' && snap.bytesTransferred < snap.totalBytes;
  }

  constructor(
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    private login: LoggedUserService,
    private $data: StudentDataService
  ) {}
}
