import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { StudentDataService } from 'src/app/services/student-data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-manager-editor',
  templateUrl: './manager-editor.component.html',
  styleUrls: ['./manager-editor.component.css'],
})
export class ManagerEditorComponent implements OnInit, OnChanges {
  @Input() id: string;
  names = new Map();
  comments: {};
  keys;
  constructor(
    private $data: StudentDataService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.getData(this.id);
  }

  ngOnChanges() {
    this.getData(this.id);
  }

  getData(id) {
    this.$data
      .studentRef(id)
      .valueChanges()
      .subscribe((res) => {
        this.comments = res.comments.reduce((objectsByKeyValue, obj) => {
          const value = obj.field;
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(
            obj
          );
          return objectsByKeyValue;
        }, {});
        this.keys = Object.keys(this.comments);
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
}
