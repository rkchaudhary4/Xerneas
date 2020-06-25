import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/services/manage.service';
import { Funcs } from 'src/app/utility/funcs';
import { User } from 'firebase';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-data',
  templateUrl: './admin-data.component.html',
  styleUrls: ['./admin-data.component.css'],
})
export class AdminDataComponent implements OnInit {
  @Input() matData;
  @Output() csv = new EventEmitter<FileList>();
  @Output() pdf = new EventEmitter<FileList>();
  isHovering: boolean;

  data;
  preData;
  columnsToDisplay = ['id', 'Manager', 'TAs', 'completedBy'];
  fields = ['uid', 'manage', 'name', 'completedBy'];
  managers;
  tas;
  taToM: number[] = [];
  sToM: number[] = [];
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private manage: ManageService,
    private funcs: Funcs
  ) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.matData.subscribe((students) => {
      this.preData = students.map((student) => {
        let completed = 0;
        student.names = [];
        student.manage = '';
        student.tas.forEach((ta, innerIndex) => {
          if (student.comments.findIndex((e) => e.ta === ta) > -1) { completed++; }
          this.afs
            .doc(`users/${ta}`)
            .valueChanges()
            .subscribe((res: User) => {
              student.names[innerIndex] = res.displayName;
              student.name = student.names.join('.');
            });
        });
        if (student.manager) {
          this.afs
            .doc(`users/${student.manager}`)
            .valueChanges()
            .subscribe((res: User) => (student.manage = res.displayName));
        }
        student.completedBy = completed;
        return student;
      });
      this.data = new MatTableDataSource(this.preData);
    });
  }

  openEditor() {
    this.router.navigate(['/dashboard/editor/' + this.preData[0].uid]);
  }

  getManagers() {
    this.getTas();
    if (!this.managers) {
      this.afs
        .collection('users', (ref) =>
          ref.where('role', '==', 'Manager').where('approved', '==', true)
        )
        .valueChanges()
        .subscribe((res) => (this.managers = res));
    }
  }

  getTas() {
    if (!this.tas) {
      this.afs
        .collection('users', (ref) =>
          ref
            .where('approved', '==', true)
            .where('role', '==', 'Teaching Assistant (TA)')
        )
        .valueChanges()
        .subscribe((res) => {
          this.tas = res;
        });
    }
  }

  assignManagersAutomatically() {
    this.tas.forEach((ta: User, index) => {
      this.manage.assignMtoTa(
        this.managers[index % this.managers.length].uid,
        ta.uid
      );
    });
  }

  assignManagersManually(){
    if (
      this.taToM.includes(null) ||
      this.taToM.includes(undefined) ||
      this.taToM.length !== this.managers.length
    ) {
      this.funcs.handleMessages('Please fill all the fields');
      return;
    }
    let sum = 0;
    this.taToM.forEach((val) => (sum += val));
    if (sum !== this.tas.length) {
      this.funcs.handleMessages(
        'Sum of all values should be ' + this.tas.length.toString()
      );
      return;
    }
    for (const val of this.taToM){
      if ( val > this.tas.length){
        this.funcs.handleMessages('You cannot assign more TAs than available to any manager.');
        return;
      }
      if ( val < 0){
        this.funcs.handleMessages('You cannot assign negative TAs to any manager.');
        return;
      }
    }
    let i = 0;
    this.taToM.forEach((no, index) => {
      for (let idx = 0; idx < no; idx++){
        if (i >= this.tas.length) {i = 0; }
        this.manage.assignMtoTa(this.managers[index].uid, this.tas[i].uid);
        i++;
      }
    });
  }

  assignStudentsAutomatically() {
    this.preData.forEach((student, index) => {
      this.manage.assignStoM(
        student.uid,
        this.managers[index % this.managers.length].uid,
      );
    });
  }

  assignStudentsManually(){
    if (
      this.sToM.includes(null) ||
      this.sToM.includes(undefined) ||
      this.sToM.length !== this.managers.length
    ) {
      this.funcs.handleMessages('Please fill all the fields');
      return;
    }
    let sum = 0;
    this.sToM.forEach((val) => (sum += val));
    if (sum !== this.preData.length) {
      this.funcs.handleMessages(
        `Sum of all values should be ${this.preData.length.toString()}`
      );
      return;
    }
    for (const val of this.sToM){
      if ( val > this.preData.length){
        this.funcs.handleMessages('You cannot assign more students than available to any manager.');
        return;
      }
      if ( val < 0){
        this.funcs.handleMessages('You cannot assign negative students to any manager.');
        return;
      }
    }
    let i = 0;
    this.sToM.forEach((no, index) => {
      for (let idx = 0; idx < no; idx++){
        if (i >= this.preData.length) {i = 0; }
        this.manage.assignStoM(this.preData[i].uid, this.managers[index].uid);
        i++;
      }
    });
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  uploadCSV(event: FileList) {
    this.csv.emit(event);
  }

  uploadPDF(event: FileList) {
    this.pdf.emit(event);
  }
}
