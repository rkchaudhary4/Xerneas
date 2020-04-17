import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user.service';
import { Funcs } from 'src/app/utility/funcs';
@Component({
  selector: 'app-login-home',
  templateUrl: './login-home.component.html',
  styleUrls: ['./login-home.component.css']
})
export class LoginHomeComponent implements OnInit {
  hide = true;
  submitted;

  constructor(private loginService: LoggedUserService, private funcs: Funcs) {
   }

  ngOnInit() {
  }

  onSubmit = (username: string, password: string): void => {
    this.submitted = true;
    this.funcs.openWaitingBar();
    this.loginService.signIn(username, password).then(() => {
      this.funcs.closeBar();
      this.loginService.isAuthenticated$.subscribe(res => this.submitted = res);
    })
    .catch(err => {
      this.funcs.closeBar();
      this.submitted = false;
    });
  };

}
