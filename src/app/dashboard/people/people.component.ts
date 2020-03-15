import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoggedUserService } from '../../services/logged-user.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  content: Array<User>;
  admin;
  columnsToDisplay = ['displayName', 'role', 'email'];
  dataSource;
  constructor(private loginService: LoggedUserService) {
    this.loginService.currentUser.subscribe(res => {
      if (res) {
        this.admin = res.role === 'Admin';
        if (this.admin) {
          this.columnsToDisplay.push('approved');
        }
      }
    });
  }

  ngOnInit(): void {
    this.loginService.getUsers().subscribe((val: Array<User>) => {
      this.content = val;
    });
  }

  approve(uid, approved) {
    if (approved) {
      this.loginService.disapprove(uid);
    } else {
      this.loginService.approve(uid);
    }
  }
}
