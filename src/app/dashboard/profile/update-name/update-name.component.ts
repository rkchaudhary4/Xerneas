import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../../../services/logged-user.service';
import { User } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-update-name',
  templateUrl: './update-name.component.html',
  styleUrls: ['./update-name.component.css']
})
export class UpdateNameComponent implements OnInit {

  user: User;

  constructor(private loginService: LoggedUserService, private snackbar: MatSnackBar, private dialog: MatDialog) {
    this.loginService.currentUser.subscribe(res => {
      this.user = res;
    });
  }

  ngOnInit(): void {
  }

  onSubmit(name: string){
    if(name === this.user.displayName ){
      this.snackbar.open('You entered the same name', '', {
        duration: 2000
      })
    } else {
      this.loginService.changeName(name);
    }
    this.dialog.closeAll();
  }

}
