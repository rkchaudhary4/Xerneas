import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-data',
  templateUrl: './admin-data.component.html',
  styleUrls: ['./admin-data.component.css']
})
export class AdminDataComponent implements OnInit {
  @Output() csv = new EventEmitter<FileList>();
  @Output() pdf = new EventEmitter<FileList>();
  isHovering: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  uploadCSV(event: FileList) {
    this.csv.emit(event);
  }

  uploadPDF(event: FileList) {
    this.pdf.emit(event);
  }

}
