import { Component, OnInit, Injectable } from '@angular/core';
import { LoggedUserService } from '../services/logged-user.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class DashboardComponent implements OnInit {
  files: { file: File; path: string }[] = [];
  completed = 0;
  user;
  isOpen: boolean;
  mobile = window.screen.width < 720;
  links = ['home', 'people', 'data', 'profile'];
  loaded = true;
  uploader = false;
  route;

  constructor(private logged: LoggedUserService, private router: Router) {
    this.router.events.subscribe((event) => {
      if ( event instanceof NavigationEnd) {
        const link = event.url.split('/')[2];
        if ( link === undefined) { this.route = 'home'; }
        else if ( link === 'editor') { this.route = ''; }
        else { this.route = link; }
      }
    });
   }

  ngOnInit(): void {
    this.logged.currentUser.subscribe(res => {
      this.user = res;
      if (this.user) { this.loaded = false; }
    });
    if (this.user && !this.user.approved) {
      this.logged.logout();
    }
    if (this.mobile) {
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  }

  logOut() {
    this.logged.logout();
  }

  toggle(button: boolean) {
    if (button) {
      this.isOpen = !this.isOpen;
    } else if (this.mobile) {
      this.isOpen = !this.isOpen;
    }
  }

  upload(fil: File, pat: string) {
    if (this.logged.currentUser.getValue().role === 'Admin') {
      this.files.push({ file: fil, path: pat });
    }
  }

  callback($event) {
    if ($event) {
      this.completed++;
    }
  }

  closeUploader() {
    if (this.files.length === this.completed) {
      this.completed = 0;
      this.files = [];
    }
  }
}
