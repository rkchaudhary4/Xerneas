import { Component, OnInit, Injectable } from '@angular/core';
import { LoggedUserService } from '../services/logged-user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class DashboardComponent implements OnInit {
  files: {file: File, path: string}[] = [];
  // files = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  completed = 0;
  user;
  isOpen: boolean;
  mobile = window.screen.width < 720;
  links = ['home', 'people', 'data', 'profile'];
  loaded = true;
  uploader = false;

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

  toggle(button: boolean){
    if (button ) {
      this.isOpen = !this.isOpen;
    }else if ( this.mobile ) {
      this.isOpen = !this.isOpen;
    }
  }

  upload(fil: File, pat: string){
    this.files.push({file: fil, path: pat});
  }

  callback($event)  {
    if( $event ) {
      this.completed++;
    }
  }

  closeUploader() {
    if( this.files.length === this.completed) {
      this.completed = 0;
      this.files = [];
    }
  }
}
