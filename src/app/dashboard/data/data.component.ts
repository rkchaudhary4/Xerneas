import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user.service';
import { StudentDataService } from '../../services/student-data.service';
import { Observable, of } from 'rxjs';
import { DashboardComponent } from '../dashboard.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  constructor(
    private loginService: LoggedUserService,
    private $data: StudentDataService,
    private dash: DashboardComponent,
    private snackbar: MatSnackBar
  ) {
    this.loginService.checkLevel('Admin').subscribe(res => (this.admin = res));
    this.percentage = -1;
  }

  ngOnInit(): void {
    this.loginService.getStudents().subscribe(res => {
      res.subscribe(students => {
        this.data = students;
      });
    });
  }

  uploadCSV(event: FileList) {
    if (this.loginService.currentUser.getValue().role === 'Admin') {
      if (event.item(0).type.split('/')[1] !== 'csv') {
        this.snackbar.open('Please upload a CSV file', '', {
          duration: 2000
        });
        return;
      } else {
        const paths = `/data.csv`;
        this.dash.upload(event.item(0), paths);
      }
    }
  }

  syncData() {
    this.$data.updateData();
  }
}
