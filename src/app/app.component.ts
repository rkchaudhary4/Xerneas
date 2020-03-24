import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoggedUserService } from './services/logged-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Xerneas';
  loaded = true;
  constructor(db: AngularFirestore, private login: LoggedUserService) {
    console.log('Hi hackers!!');
  }
}
