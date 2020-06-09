import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectorRef,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() content;
  @Input() columnsToDisplay: Array<string>;
  @Output() toggle: EventEmitter<any> = new EventEmitter();
  constructor(private ChangeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.content) {
      this.content = new MatTableDataSource(this.content);
      this.ChangeDetector.detectChanges();
      this.content.paginator = this.paginator;
    }
  }

  chang(uid, approved){
    this.toggle.emit({uid, approved});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.content.filter = filterValue.trim().toLowerCase();
  }
}
