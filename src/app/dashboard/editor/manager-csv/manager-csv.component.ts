import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manager-csv',
  templateUrl: './manager-csv.component.html',
  styleUrls: ['./manager-csv.component.css']
})
export class ManagerCsvComponent implements OnInit {
  @Input() currentData;
  @Input() headers;
  @Output() data = new EventEmitter<object>();
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  submit(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure? This will change the csv file'
    });
    dialogRef.afterClosed().subscribe((flag: boolean) => {
      if (flag) {
        console.log('df',  this.currentData);
        this.data.emit(this.currentData);
      }
    })
  }

}
