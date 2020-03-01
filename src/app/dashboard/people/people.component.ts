import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  content: Array<User>

  columnsToDisplay = ['displayName', 'role', 'approved', 'email'];

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.afs.collection('users').valueChanges().subscribe((val: Array<User>) => {
      console.log(val);
      this.content = val;
    })
  }

}
