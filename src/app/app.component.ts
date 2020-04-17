import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoggedUserService } from './services/logged-user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WaitingBarComponent } from './waiting-bar/waiting-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Xerneas';
  loaded = true;
  d: MatDialogRef<WaitingBarComponent, any>;
  constructor(db: AngularFirestore, private login: LoggedUserService, private dialog: MatDialog) {
    console.log('Hi hackers!!');
  }
  close() {
    this.d.close();
  }
}
