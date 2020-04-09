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
  columnsToDisplay = ['id', 'TAs'];
  fields = ['uid', 'name'];
  constructor(private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.matData.subscribe((students) => {
      this.preData = students.map((student, index) => {
        student.names = [];
        student.tas.forEach((ta, innerIndex) => {
          this.afs.doc(`users/${ta}`).valueChanges().subscribe((res: User) => {
            this.updateNames(res.displayName, index, innerIndex);
          });
        })
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
