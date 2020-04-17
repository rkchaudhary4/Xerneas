import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Papa } from 'ngx-papaparse';
import { FormGroup, FormControl } from '@angular/forms';
import { LoggedUserService } from '../../services/logged-user.service';
import { StudentDataService } from '../../services/student-data.service';
import { first, finalize } from 'rxjs/internal/operators';

import { SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  loaded = false;
  uid;
  id;
  data;
  headers;
  index: number;
  url: SafeUrl;
  lvl;
  fields: string[];
  students = [];
  currentData;

  constructor(
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private papa: Papa,
    private login: LoggedUserService,
    private $data: StudentDataService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loaded = false;
  }

  ngOnInit(): void {
    this.login.currentUser.subscribe(res => {
      if (res) {
        this.lvl = res.role;
        this.uid = res.uid;
      }
    });
    this.id = this.route.snapshot.paramMap.get('id');
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
            this.headers = result.meta.fields;
            this.data = result.data;
            this.routeIt(this.id);
          }
        });
      });
    this.login.getStudents().subscribe(res => {
      res.subscribe(data => {
        this.students = data;
      });
    });
  }

  routeIt(id) {
    this.id = id;
    const path = this.id + '.pdf';
    this.storage
      .ref(`/pdfs/${path}`)
      .getDownloadURL()
      .subscribe(res => (this.url = res));
    this.index = this.data.findIndex(e => e.id === this.id);
    this.currentData = this.data[this.index];
    this.fields = this.headers.map(x => x);
    this.loaded = true;
  }


  onSubmit(newData) {
        const path = `/data.csv`;
        const ref = this.storage
          .ref(path)
          .getDownloadURL()
          .pipe(first());
        ref.subscribe(res => {
          this.papa.parse(res, {
            download: true,
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: result => {
              const currentData = result.data;
              currentData[this.index] = newData;
              this.data = currentData;
              const csv = new Blob([this.papa.unparse(currentData)], {
                type: 'text/csv;charset=utf-8;'
              });
              const file = new File([csv], 'data.csv', { type: 'text/csv' });
              this.storage.upload(path, file).snapshotChanges().pipe(
                finalize(() => {
                  this.router.navigate(['/dashboard/data']);
                })
              ).subscribe();
            }
          });
        });
      }
}
