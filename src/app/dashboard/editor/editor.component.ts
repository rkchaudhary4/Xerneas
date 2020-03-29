import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Papa } from 'ngx-papaparse';
import { FormGroup, FormControl } from '@angular/forms';
import { LoggedUserService } from '../../services/logged-user.service';
import { StudentDataService } from '../../services/student-data.service';
import { first } from 'rxjs/internal/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { Student } from '../../models/student';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  loaded = false;
  name: string;
  uid;
  id: number;
  data;
  headers;
  index: number;
  url: SafeUrl;
  fb: FormGroup;
  lvl;
  fields: string[];
  availfields: string[];
  students = [];
  currentData;
  taComment: { field: string; comment: string }[];
  comments: { field: string; comment: string; ta: string }[];

  constructor(
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private papa: Papa,
    private login: LoggedUserService,
    private $data: StudentDataService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.loaded = false;
  }

  remove(i: number) {
    this.fields.push(this.taComment[i].field);
    this.taComment.splice(i, 1);
  }

  addRow() {
    this.taComment.push({ field: '', comment: '' });
  }

  ngOnInit(): void {
    this.login.currentUser.subscribe(res => {
      if (res) {
        this.lvl = res.role;
        this.uid = res.uid;
        this.name = res.displayName;
      }
    });
    this.id = +this.route.snapshot.paramMap.get('id');
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
    this.id = +id;
    this.getData(this.id);
    const path = this.id + '.pdf';
    this.storage
      .ref(`/pdfs/${path}`)
      .getDownloadURL()
      .subscribe(res => (this.url = res));
    this.index = this.data.findIndex(e => e.id === this.id);
    this.currentData = this.data[this.index];
    this.fields = this.headers.map(x => x);
    if (this.lvl === 'Manager' || this.lvl === 'Admin') {
      const group: any = {};
      this.headers.forEach(field => {
        group[field] = new FormControl(this.currentData[field]);
      });
      this.fb = new FormGroup(group);
    }
  }

  filter(i) {
    this.availfields = this._filter(this.taComment[i].field);
  }

  private _filter(value: string): string[] {
    const filtervalue = value.toLowerCase();
    if (this.fields)
      return this.fields.filter(option =>
        option.toLowerCase().includes(filtervalue)
      );
    else return [];
  }

  add(option) {
    const Index = this.fields.indexOf(option);
    if (Index >= 0) this.fields.splice(Index, 1);
  }

  onSubmit() {
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
          currentData[this.index] = this.fb.value;
          this.data = currentData;
          const csv = new Blob([this.papa.unparse(currentData)], {
            type: 'text/csv;charset=utf-8;'
          });
          const file = new File([csv], 'data.csv', { type: 'text/csv' });
          // this.$data.uploadData(file);
          this.$data.snapshot.subscribe(task => {
            if (task.bytesTransferred === task.totalBytes) {
              this.snackbar.open('File uploaded successfully', '', {
                duration: 2000
              });
              this.router.navigate(['/dashboard/data']);
            }
          });
        }
      });
    });
  }

  getData(id) {
    if (this.lvl === 'Teaching Assistant (TA)') {
      this.$data
        .taRef(this.uid, id)
        .valueChanges()
        .pipe(first())
        .subscribe(res => {
          this.taComment = res.comments;
          if (res.comments.length === 0) {
            this.taComment.push({ field: '', comment: '' });
          }
          this.taComment.forEach(key => {
            const i = this.fields.indexOf(key.field);
            if (i >= 0) this.fields.splice(i, 1);
          });
          this.loaded = true;
        });
    }
    if (this.lvl === 'Manager' || this.lvl === 'Admin') {
      this.$data
        .studentRef(id)
        .valueChanges()
        .subscribe(res => {
          this.comments = res.comments;
          this.loaded = true;
        });
    }
  }

  save() {
    this.$data.taRef(this.uid, this.id.toString()).update({
      comments: this.taComment,
      time: Timestamp.now()
    });
  }

  submit() {
    const studentRef = this.$data.studentRef(this.id.toString());
    studentRef
      .valueChanges()
      .pipe(first())
      .subscribe((student: Student) => {
        const submitted = this.taComment.map(res => ({...res, ta: this.name}));
        console.log(submitted);
        // this.router.navigate(['/dashboard/data']);
      });
  }
}
