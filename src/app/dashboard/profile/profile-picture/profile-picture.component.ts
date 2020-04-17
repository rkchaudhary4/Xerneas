import { Component, OnInit } from '@angular/core';
import {
  AngularFireStorage
} from '@angular/fire/storage';
import { LoggedUserService } from '../../../services/logged-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Funcs } from '../../../funcs';
@Component({
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent implements OnInit {
  file: File;
  path: string;
  id: string

  constructor(
    private login: LoggedUserService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private storage: AngularFireStorage,
    private funcs: Funcs
  ) {}

  ngOnInit(): void {}

  upload(event: FileList) {
    this.file = event.item(0);
    if( this.file.type.split('/')[0] !== 'image') {
      this.funcs.handleMessages('Please upload a valid image');
      return;
    } else if(this.file.size > 1000000){
      this.funcs.handleMessages('File size must be less than 1 MB');
      return;
    } else {
      this.id = this.login.currentUser.getValue().uid;
      const name = this.id + '.' + this.file.type.split('/')[1];
      this.path = `/profile_pictures/${name}`;
    }
  }

  complete($event) {
    if( $event ) {
      this.storage.ref(this.path).getDownloadURL().subscribe(res => {
        this.login.userRef(this.id).update({
          dpUrl: res
        })
      this.dialog.closeAll();
        this.funcs.handleMessages('Profile Picture updated successfully');
      })
    }
  }
}
