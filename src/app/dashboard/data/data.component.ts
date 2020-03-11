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

  constructor(private loginService: LoggedUserService, private $data: StudentDataService) {
    this.loginService.checkLevel('Admin').subscribe(res => this.admin = res);
    this.percentage = -1;
    this.$data.assignManager('1', 'HqhzW9O5epY6CIGXWEmZEHWYKtR2');
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
    this.$data.getData().subscribe(res => this.data = res);
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
}
