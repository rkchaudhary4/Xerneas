import { Component, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Xerneas';
  loaded = true;
  constructor(db: AngularFirestore) {
    console.log('Hi hackers!!');
  }

  ngAfterViewInit(): void {
    const self = this;
    window.addEventListener('load', (ev) =>
      self.loaded = false
    )
  }
}
