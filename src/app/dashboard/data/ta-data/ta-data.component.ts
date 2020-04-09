import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ta-data',
  templateUrl: './ta-data.component.html',
  styleUrls: ['./ta-data.component.css'],
  providers: [DatePipe]
})
export class TaDataComponent implements OnInit {
  @Input() matData;
  data;
  columnsToDisplay = ['Id', 'Last Edited'];
  fields = ['uid', 'edited'];
  constructor(private date: DatePipe, private router: Router) { }

  ngOnInit(): void {
    this.matData.subscribe(students => {
      students.map(student => student.edited = this.date.transform(student.time.toDate(), 'medium'));
      this.data = new MatTableDataSource(students);
    })
  }

  openEditor(){
    this.router.navigate(['/dashboard/editor/' + this.data.data[0].uid]);
  }

}
