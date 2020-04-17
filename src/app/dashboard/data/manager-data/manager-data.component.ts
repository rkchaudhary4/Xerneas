import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-manager-data',
  templateUrl: './manager-data.component.html',
  styleUrls: ['./manager-data.component.css'],
})
export class ManagerDataComponent implements OnInit {
  @Input() matData;
  preData;
  data;
  columnsToDisplay = ['id', 'TAs', 'completedBy'];
  fields = ['uid', 'name', 'completedBy'];
  constructor(private afs: AngularFirestore) {}

  ngOnInit(): void {
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
        // if( completed === student.tas.length) ;
        return student;
      })
    });
  }

  updateNames(name, index, innerIndex) {
    this.preData[index].names[innerIndex] = name;
    this.preData[index].name = this.preData[index].names.join('.');
    this.data = new MatTableDataSource(this.preData);
  }

  log(){
    console.log(this.preData);
  }
}
