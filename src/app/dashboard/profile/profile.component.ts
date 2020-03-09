import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateNameComponent } from './update-name/update-name.component';
import { LoggedUserService } from '../../services/logged-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private dialog: MatDialog, private loginService: LoggedUserService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  changePass(){
    this.loginService.currentUser.subscribe(res => {
      this.loginService.resetPassword(res.email);
    })
  }

  open(){
    this.dialog.open( UpdateNameComponent, {

    });
  }

}
