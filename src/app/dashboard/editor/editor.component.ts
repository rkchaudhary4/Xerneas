import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Papa } from 'ngx-papaparse';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormGroup, FormControl } from '@angular/forms';
import { LoggedUserService } from '../../services/logged-user.service';
import { StudentDataService } from '../../services/student-data.service';
import { first, startWith, map } from 'rxjs/internal/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/internal/Observable';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { Student } from '../../models/student';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  myFields = new FormControl();
  uid;
  id: number;
  data;
  headers;
  index: number;
  url: SafeUrl;
  fb: FormGroup;
  lvl;
  fields: string[];
  selected: string[] = [];
  availfields: Observable<string[]>;
  students = [];
  currentData;
  comment: string;
  comments: string[];
  constructor(
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private papa: Papa,
    private sanitizer: DomSanitizer,
    private login: LoggedUserService,
    private $data: StudentDataService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.login.currentUser.subscribe(res => {
      if (res) {
        this.lvl = res.role;
        this.uid = res.uid;
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
    this.selected = [];
    this.id = +id;
    this.getData(this.id);
    const path = this.id + '.pdf';
    this.storage.ref(`/pdfs/${path}`).getDownloadURL().subscribe(res => this.url = res);
    this.index = this.data.findIndex(e => e.id === this.id);
    this.currentData = this.data[this.index];
    this.fields = this.headers.map(x => x);
    const group: any = {};
    this.headers.forEach(field => {
      group[field] = new FormControl(this.currentData[field]);
    });
    this.fb = new FormGroup(group);
    this.availfields = this.myFields.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
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
    this.myFields.setValue('');
    this.selected.push(option);
    const Index = this.fields.indexOf(option);
    if (Index >= 0) this.fields.splice(Index, 1);
  }

  delete(select: string) {
    this.selected = this.selected.filter(field => field !== select);
    this.fields.push(select);
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
          this.$data.uploadData(file);
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
    if( this.lvl === 'Teaching Assistant (TA)') {
      this.$data.taRef(this.uid, id).valueChanges().pipe(first()).subscribe(res => {
        res.fields.forEach(obj => this.add(obj));
        this.comment = res.comments;
        document.getElementById('comment').innerHTML = this.comment;
      })
    }
    if( this.lvl === 'Manager' || this.lvl === 'Admin') {
      this.$data.studentRef(id).valueChanges().subscribe(res =>{
        this.selected = res.fields;
        this.comments = res.comments;
      })
    }
  }

  save(comment){
    this.comment = comment
    this.$data.taRef(this.uid, this.id.toString()).update({
      comments: this.comment,
      fields: this.selected,
      time: Timestamp.now()
    })
  }

  submit(comment) {
    const studentRef = this.$data.studentRef(this.id.toString());
    studentRef.valueChanges().pipe(
      first()).subscribe((student: Student) => {
        const fieldss = student.fields;
        this.selected.forEach(obj => {
          if( !(fieldss.includes(obj)) ) fieldss.push(obj);
        })
        studentRef.update({
          comments: [...student.comments, comment],
          fields: fieldss,
        })
        this.router.navigate(['/dashboard/data']);
      })
  }
}
