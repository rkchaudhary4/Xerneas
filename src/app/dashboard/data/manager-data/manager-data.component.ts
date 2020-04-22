import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/services/manage.service';
@Component({
  selector: 'app-manager-data',
  templateUrl: './manager-data.component.html',
  styleUrls: ['./manager-data.component.css'],
})
export class ManagerDataComponent implements OnInit {
  @Input() matData;
  @Input() uid;
  names = new Map();
  preData;
  data;
  managerTAs;
  columnsToDisplay = ['id', 'TAs', 'completedBy'];
  fields = ['uid', 'name', 'completedBy'];
  nos: number[] = [];
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private manage: ManageService
  ) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.matData.subscribe((students) => {
      this.preData = students.map((student) => {
        let completed = 0;
        student.names = [];
        student.tas.forEach((ta, innerIndex) => {
          if (student.comments.findIndex((e) => e.ta === ta) > -1) completed++;
          this.afs
            .doc(`users/${ta}`)
            .valueChanges()
            .subscribe((res: User) => {
              student.names[innerIndex] = res.displayName;
              student.name = student.names.join('.');
            });
        });
        student.completedBy = completed;
        return student;
      });
      this.data = new MatTableDataSource(this.preData);
    });
  }

  getName(uid) {
    if (!this.names.has(uid)) {
      this.afs
        .doc(`users/${uid}`)
        .valueChanges()
        .subscribe((res: User) => this.names.set(uid, res.displayName));
    }
    return this.names.get(uid);
  }

  openEditor() {
    this.router.navigate(['/dashboard/editor/' + this.preData[0].uid]);
  }

  getTas() {
    if (!this.managerTAs) {
      this.afs
        .collection('users', (ref) => ref.where('manager', '==', this.uid))
        .valueChanges()
        .subscribe((res) => {
          this.managerTAs = res;
        });
    }
  }

  assignAutomatically() {
    const max = this.managerTAs.length;
    this.preData.forEach((element, index) => {
      const id = element.uid;
      const tas = [
        this.managerTAs[index % max].uid,
        this.managerTAs[(index + 1) % max].uid,
        this.managerTAs[(index + 2) % max].uid,
      ];
      this.manage.assignStoTa(id, tas);
    });
  }

  assignManually() {
    console.log(this.nos);
  }
}
