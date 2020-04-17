import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Funcs } from '../../../funcs';

@Component({
  selector: 'app-manager-csv',
  templateUrl: './manager-csv.component.html',
  styleUrls: ['./manager-csv.component.css']
})
export class ManagerCsvComponent implements OnInit {
  @Input() currentData;
  @Input() headers;
  @Output() data = new EventEmitter<object>();
  constructor(private funcs: Funcs) { }

  ngOnInit(): void {
  }

  submit(){
    this.funcs.confirmDialog('Are you sure? This will change the csv file').subscribe((flag: boolean) => {
      if (flag) {
        this.funcs.openWaitingBar();
        console.log('df',  this.currentData);
        this.data.emit(this.currentData);
      }
    })
  }
}
