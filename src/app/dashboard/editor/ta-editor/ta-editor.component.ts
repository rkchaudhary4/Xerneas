import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { StudentDataService } from 'src/app/services/student-data.service';
import { first } from 'rxjs/operators';
import { Student } from 'src/app/models/student';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { Router } from '@angular/router';
import { Funcs } from 'src/app/utility/funcs';

@Component({
  selector: 'app-ta-editor',
  templateUrl: './ta-editor.component.html',
  styleUrls: ['./ta-editor.component.css'],
})
export class TaEditorComponent implements OnInit, OnChanges {
  @Input() id: string;
  @Input() uid: string;
  @Input() fields: string[];

  availfields: string[];

  taComment: { field: string; comment: string }[];
  constructor(
    private $data: StudentDataService,
    private router: Router,
    private funcs: Funcs
  ) {}

  ngOnInit(): void {
    this.getData(this.id);
  }

  ngOnChanges() {
    this.getData(this.id);
  }

  getData(id) {
    this.$data
      .taRef(this.uid, id)
      .valueChanges()
      .pipe(first())
      .subscribe((res) => {
        this.taComment = res.comments;
        if (res.comments.length === 0) {
          this.taComment.push({ field: '', comment: '' });
        }
        this.taComment.forEach((key) => {
          const i = this.fields.indexOf(key.field);
          if (i >= 0) { this.fields.splice(i, 1); }
        });
      });
  }

  remove(i: number) {
    this.fields.push(this.taComment[i].field);
    this.taComment.splice(i, 1);
  }

  addRow() {
    this.taComment.push({ field: '', comment: '' });
  }

  filter(i) {
    this.availfields = this._filter(this.taComment[i].field);
  }

  private _filter(value: string): string[] {
    const filtervalue = value.toLowerCase();
    if (this.fields) {
      return this.fields.filter((option) =>
        option.toLowerCase().includes(filtervalue)
      );
    }
    else { return []; }
  }

  add(option) {
    const Index = this.fields.indexOf(option);
    if (Index >= 0) { this.fields.splice(Index, 1); }
  }

  save() {
    this.$data
      .taRef(this.uid, this.id.toString())
      .update({
        comments: this.taComment,
        time: Timestamp.now(),
      })
      .then(() => {
        this.funcs.handleMessages('Data Saved');
      });
  }

  submit() {
    this.funcs
      .confirmDialog(
        'Are you sure? You will not be able to open this again after submitting'
      )
      .subscribe((flag: boolean) => {
        if (flag) {
          this.funcs.openWaitingBar();
          const studentRef = this.$data.studentRef(this.id);
          studentRef
            .valueChanges()
            .pipe(first())
            .subscribe((student: Student) => {
              const submitted = this.taComment.map((res) => ({
                ...res,
                ta: this.uid,
              }));
              studentRef.update({
                comments: student.comments.concat(submitted),
              }).then(() => {
                this.funcs.closeBar();
                this.$data.taRef(this.uid, this.id.toString()).delete();
                this.router.navigate(['/dashboard/data']);
              });
            });
        }
      });
  }
}
