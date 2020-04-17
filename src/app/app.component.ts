import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Xerneas';
  loaded = true;
  constructor() {
    console.log('Hi hackers!!');
  }
}
