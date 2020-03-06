import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user.service';

@Component({
  selector: 'app-login-home',
  templateUrl: './login-home.component.html',
  styleUrls: ['./login-home.component.css']
})
export class LoginHomeComponent implements OnInit {
  hide = true;
  submitted;

  constructor(private loginService: LoggedUserService) {
   }

  ngOnInit() {
  }

  onSubmit = (username: string, password: string): void => {
    this.submitted = true;
    this.loginService.signIn(username, password).then(() => {
      this.loginService.isAuthenticated$.subscribe(res => this.submitted = res);
    })
    .catch(err => {
      this.submitted = false;
    });
  };

}
