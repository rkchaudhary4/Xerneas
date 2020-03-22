import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../services/logged-user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user;
  isOpen: boolean;
  mobile = window.screen.width < 720;
  links = ['home', 'people', 'data', 'profile'];
  loaded = true;

  constructor(private logged: LoggedUserService) { }

  ngOnInit(): void {
    this.logged.currentUser.subscribe(res => {
      this.user=res;
      if( this.user ) this.loaded = false;
    });
    if( this.user && !this.user.approved ){
      this.logged.logout();
    }
    if( this.mobile ) {
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  }

  logOut(){
    this.logged.logout();
  }

  toggle(){
    if ( this.mobile ) {
      this.isOpen = !this.isOpen;
    }
  }
}
