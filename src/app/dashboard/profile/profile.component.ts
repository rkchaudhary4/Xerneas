import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateNameComponent } from './update-name/update-name.component';
import { LoggedUserService } from '../../services/logged-user.service';
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user;
  manager;
  constructor(
    private dialog: MatDialog,
    private loginService: LoggedUserService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.loginService.currentUser.subscribe((res) => {
      this.user = res;
      if ( res && res.manager ) {
        this.afs
          .doc(`users/${res.manager}`)
          .valueChanges()
          .subscribe((name: User) => (this.manager = name.displayName));
      }
    });
  }

  changePass() {
    this.loginService.currentUser.subscribe((res) => {
      this.loginService.resetPassword(res.email);
    });
  }

  open() {
    this.dialog.open(UpdateNameComponent, {});
  }

  openPic() {
    this.dialog.open(ProfilePictureComponent, {});
  }
}
