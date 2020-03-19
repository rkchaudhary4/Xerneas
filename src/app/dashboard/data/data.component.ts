import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user.service';
import { StudentDataService } from '../../services/student-data.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  data;
  admin;
  percentage = -1;
  snapshot: Observable<any> = of(null);
 // 9mghlLnVGkbQQOEocE7D9TX0DGs2
 // HqhzW9O5epY6CIGXWEmZEHWYKtR2
 // lZ5Qy3FRv1dV9vr8bXdU06ptAmt2 (TA)
  constructor(private loginService: LoggedUserService, private $data: StudentDataService) {
    this.loginService.checkLevel('Admin').subscribe(res => this.admin = res);
    this.percentage = -1;
  }

  isActive(snapshot){
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  pause(){
    this.$data.pause();
  }

  resume(){
    this.$data.resume();
  }

  cancel(){
    this.$data.cancel();
    this.snapshot = null;
  }

  ngOnInit(): void {
    this.loginService.getStudents().subscribe(res => {
      res.subscribe(students => {
        this.data = students;
      });
    });
    }

    upload(event: FileList){
      const file = event.item(0);
      this.$data.uploadData(file);
      this.snapshot = this.$data.snapshot;
      this.$data.percentage.subscribe(res => this.percentage = res);
      this.$data.snapshot.subscribe(res => {
        if (res.bytesTransferred === res.totalBytes ) {
          this.snapshot = null;
          this.$data.updateData();
        }
      })
    }

    syncData(){
      this.$data.updateData();
    }
}
