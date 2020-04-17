import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ta-csv',
  templateUrl: './ta-csv.component.html',
  styleUrls: ['./ta-csv.component.css']
})
export class TaCsvComponent implements OnInit {
  @Input() currentData;
  @Input() headers;

  constructor() { }

  ngOnInit(): void {
  }

}
