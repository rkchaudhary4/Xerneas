import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.css'],
})
export class MatTableComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() data;
  @Input() columnsToDisplay: Array<string>;
  @Input() fields: Array<string>;
  constructor(private ChangeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.data) {
      this.ChangeDetector.detectChanges();
      this.data.paginator = this.paginator;
    }
  }

  getVal(col) {
    return this.fields[this.columnsToDisplay.indexOf(col)];
  }
}
