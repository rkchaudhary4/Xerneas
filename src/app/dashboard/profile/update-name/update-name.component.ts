import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../../../services/logged-user.service';
import { User } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Funcs } from 'src/app/utility/funcs';
@Component({
  selector: 'app-update-name',
  templateUrl: './update-name.component.html',
  styleUrls: ['./update-name.component.css']
})
export class UpdateNameComponent implements OnInit {

  user: User;

  constructor(private loginService: LoggedUserService, private snackbar: MatSnackBar, private dialog: MatDialog, private funcs: Funcs) {
    this.loginService.currentUser.subscribe(res => {
      this.user = res;
    });
  }

  ngOnInit(): void {
  }

  onSubmit(name: string){
    if (name === this.user.displayName ){
      this.funcs.handleMessages('You entered the same name');
    } else {
      this.loginService.changeName(name);
    }
    this.dialog.closeAll();
  }

}
