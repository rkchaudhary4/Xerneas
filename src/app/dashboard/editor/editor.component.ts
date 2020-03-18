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

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  myFields = new FormControl();
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
      if (res) this.lvl = res.role;
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
          console.log(data);
          data.forEach(obj => this.students.push(obj));
        });
      });
  }

  routeIt(id) {
    this.id = +id;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      '/assets/' + this.id + '.pdf'
    );
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
}
