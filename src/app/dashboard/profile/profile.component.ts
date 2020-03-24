import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateNameComponent } from './update-name/update-name.component';
import { LoggedUserService } from '../../services/logged-user.service';
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private dialog: MatDialog, private loginService: LoggedUserService) { }

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

  openPic(){
    this.dialog.open(ProfilePictureComponent, {
    });
  }

}
