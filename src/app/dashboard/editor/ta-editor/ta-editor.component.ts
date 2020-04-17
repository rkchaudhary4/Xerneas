import { Component, OnInit, Input } from '@angular/core';
import { StudentDataService } from 'src/app/services/student-data.service';
import { first } from 'rxjs/internal/operators';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { Student } from 'src/app/models/student';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ta-editor',
  templateUrl: './ta-editor.component.html',
  styleUrls: ['./ta-editor.component.css'],
})
export class TaEditorComponent implements OnInit {
  @Input() id: string;
  @Input() uid: string;
  @Input() fields: string[];

  availfields: string[];

  taComment: { field: string; comment: string }[];
  constructor(
    private $data: StudentDataService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
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
          if (i >= 0) this.fields.splice(i, 1);
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
    if (this.fields)
      return this.fields.filter((option) =>
        option.toLowerCase().includes(filtervalue)
      );
    else return [];
  }

  add(option) {
    const Index = this.fields.indexOf(option);
    if (Index >= 0) this.fields.splice(Index, 1);
  }

  save() {
    this.$data.taRef(this.uid, this.id.toString()).update({
      comments: this.taComment,
      time: Timestamp.now(),
    });
  }

  submit() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:
        'Are you sure? You will not be able to open this again after submitting',
    });
    dialogRef.afterClosed().subscribe((flag: boolean) => {
      if (flag) {
        this.$data.taRef(this.uid, this.id.toString()).delete();
        this.router.navigate(['/dashboard/data']);
      }
    });
  }
}
