import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../services/logged-user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user;
  isOpen = true;
  mobile = window.screen.width < 720;
  links = ['home', 'people', 'data', 'profile'];

  constructor(private logged: LoggedUserService) { }

  ngOnInit(): void {
    this.logged.currentUser.subscribe(res => this.user=res);
  }

  logOut(){
    this.logged.logout();
  }
}
