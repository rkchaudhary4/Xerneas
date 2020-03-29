import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user.service';
import { DashboardComponent } from '../dashboard.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageService } from '../../services/manage.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  data;
  admin;
  isHovering: boolean;
  // lZ5Qy3FRv1dV9vr8bXdU06ptAmt2 (TA)
  constructor(
    private loginService: LoggedUserService,
    private manage: ManageService,
    private dash: DashboardComponent,
    private snackbar: MatSnackBar
  ) {
    this.loginService.checkLevel('Admin').subscribe(res => (this.admin = res));
  }

  ngOnInit(): void {
    this.loginService.getStudents().subscribe(res => {
      res.subscribe(students => {
        this.data = students;
      });
    });
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
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

  uploadPDF(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type.split('/')[1] === 'pdf') {
        const path = `/pdfs/${files.item(i).name}`;
        this.dash.upload(files.item(i), path);
      }
    }
  }
}
