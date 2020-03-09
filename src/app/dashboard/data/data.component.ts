import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  file;
  data;

  constructor(private papa: Papa, private http: HttpClient) {
    this.file = this.http.get('/assets/m.tech-25.csv', {responseType:'text'}).subscribe(res => {this.extractData(res)});
  }

  ngOnInit(): void {
    }

    extractData(res){
      const data = res || '';
      this.papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.data = result.data;
          // console.log(result);
        }
      });
    }
}
