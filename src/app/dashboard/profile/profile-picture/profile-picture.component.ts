import { Component, OnInit } from '@angular/core';
import {
  AngularFireStorage
} from '@angular/fire/storage';
import { LoggedUserService } from '../../../services/logged-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

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
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {}

  upload(event: FileList) {
    this.file = event.item(0);
    if( this.file.type.split('/')[0] !== 'image') {
      this.snackbar.open('Please upload a valid image', '', {
        duration: 2000
      });
      return;
    } else if(this.file.size > 1000000){
      this.snackbar.open('File size must be less than 1 MB', '', {
        duration: 2000
      });
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
        this.snackbar.open('Profile Picture updated successfully', '', {
          duration: 2000
        })
      })
    }
  }

  // upload(event: FileList) {
    // const file = event.item(0);
    // if (file.type.split('/')[0] !== 'image' || file.type.split('/')[1] ==='gif') {
      // this.snackbar.open('Please upload a valid image', '', {
        // duration: 2000
      // });
      // return;
    // }
    // if (file.size > 1000000) {
      // this.snackbar.open('File size must be less than 1 MB', '', {
        // duration: 2000
      // });
      // return;
    // }
    // const id = this.login.currentUser.getValue().uid;
    // const name = id + '.' + file.type.split('/')[1];
    // const path = `/profile_pictures/${name}`;
    // this.task = this.storage.upload(path, file);
    // this.percentage = this.task.percentageChanges();
    // this.snapshot = this.task.snapshotChanges().pipe(
      // tap(snap => {
        // if (snap.bytesTransferred === snap.totalBytes) {
          // this.dialog.closeAll();
          // this.snackbar.open('Picture Updated Successfully', '', {
            // duration: 2000
          // });
        // }
      // }),
      // finalize(() => {
        // this.storage
          // .ref(path)
          // .getDownloadURL()
          // .subscribe(res => {
            // this.downloadURL = res;
            // this.login.userRef(id).update({
              // dpUrl: this.downloadURL
            // });
          // });
      // })
    // );
  // }

  // isActive(snapshot) {
  //   return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  // }
}
