import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-home',
  templateUrl: './login-home.component.html',
  styleUrls: ['./login-home.component.css']
})
export class LoginHomeComponent implements OnInit {

  submitted;

  constructor(private loginService: LoggedUserService) {
   }

  ngOnInit() {
  }

  onSubmit = (username: string, password: string): void => {
    this.submitted = true;
    this.loginService.signIn(username, password).then(() => {
      this.loginService.isAuthenticated$.subscribe(res => this.submitted = res);
      console.log('logged');
    })
    .catch(err => {
      this.submitted = false;
    });
  };

}
