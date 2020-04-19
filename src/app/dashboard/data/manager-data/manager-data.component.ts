import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-data',
  templateUrl: './manager-data.component.html',
  styleUrls: ['./manager-data.component.css'],
})
export class ManagerDataComponent implements OnInit {
  @Input() matData;
  @Input() uid;
  preData;
  data;
  managerTAs;
  columnsToDisplay = ['id', 'TAs', 'completedBy'];
  fields = ['uid', 'name', 'completedBy'];
  constructor(private afs: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
  }

  getStudents() {
    this.matData.subscribe((students) => {
      this.preData = students.map((student, index) => {
        let completed =0;
        student.names = [];
        student.tas.forEach((ta, innerIndex) => {
          if( student.comments.findIndex(e => e.ta === ta) > -1)completed++;
          this.afs.doc(`users/${ta}`).valueChanges().subscribe((res: User) => {
            this.updateNames(res.displayName, index, innerIndex);
          });
        })
        student.completedBy = completed;
        return student;
      })
    });
  }


  updateNames(name, index, innerIndex) {
    this.preData[index].names[innerIndex] = name;
    this.preData[index].name = this.preData[index].names.join('.');
    this.preData.sort((a, b) => a.completedBy > b.completedBy ? -1 : a.completeBy < b.completedBy ? 1 : 0);
    this.data = new MatTableDataSource(this.preData);
  }

  openEditor() {
    this.router.navigate(['/dashboard/editor/' + this.preData[0].uid]);
  }

  getTas() {
    this.afs.collection('users', ref => ref.where('manager', '==', this.uid)).valueChanges().subscribe(res => {
      this.managerTAs = res
    });
  }

}
