import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private loginService: LoggedUserService) { }

  onSubmit = (email: string) => {
    console.log(email);
    this.loginService.resetPassword(email);
  }

  ngOnInit(): void {
  }

}
