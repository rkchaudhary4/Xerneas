import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { LoggedUserService } from '../../services/logged-user.service';
import { ManageService } from '../../services/manage.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})
export class PeopleComponent implements OnInit {
  admins: Array<User>;
  managers: Array<User>;
  tas: Array<User>;
  admin;
  columnsToDisplay = ['displayName', 'role', 'email'];
  dataSource;
  constructor(private loginService: LoggedUserService) {}

  ngOnInit(): void {
    this.loginService.currentUser.subscribe((res) => {
      if (res) {
        this.admin = res.role === 'Admin';
        if (this.admin) {
          this.columnsToDisplay.push('approved');
        }
      }
    });

    this.loginService.getUsers().subscribe((val: Array<User>) => {
        this.admins = val.filter((user) => user.role === 'Admin' && (this.admin || user.approved));
        this.managers = val.filter((user) => user.role === 'Manager' && (this.admin || user.approved));
        this.tas = val.filter((user) => user.role === 'Teaching Assistant (TA)' && (this.admin || user.approved));
    });
  }

  approve({uid, approved}) {
    if (approved) {
      this.loginService.disapprove(uid);
    } else {
      this.loginService.approve(uid);
    }
  }
}
