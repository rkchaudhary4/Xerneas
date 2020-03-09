import { Component, OnInit } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import { HttpClient } from '@angular/common/http';
import { LoggedUserService } from '../../services/logged-user.service';
import { StudentDataService } from '../../services/student-data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  data;
  admin;

  constructor(private papa: Papa, private http: HttpClient, private loginService: LoggedUserService, private $data: StudentDataService) {
    this.loginService.checkLevel('Admin').subscribe(res => this.admin = res);
  }

  ngOnInit(): void {
    this.$data.getData().then((res: ParseResult) => {
      this.data = res.data;
      console.log(res);
    });
    }

    upload(event: FileList){
      const file = event.item(0);
      this.$data.uploadData(file);
    }
}
