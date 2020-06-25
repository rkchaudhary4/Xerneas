import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { WaitingBarComponent } from './waiting-bar/waiting-bar.component';

@Injectable()
export class Funcs {
  constructor(private snackbar: MatSnackBar, private dialog: MatDialog) {}
  d: MatDialogRef<WaitingBarComponent, any>;
  handleMessages(message) {
    this.snackbar.open(message, '', {
      duration: 2000,
    });
  }

  confirmDialog(message) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: message,
    });
    return dialogRef.afterClosed();
  }

  openWaitingBar() {
    this.d = this.dialog.open(WaitingBarComponent, {
      disableClose: true,
      width: '500px',
    });
  }

  closeBar() {
    this.d.close();
  }
}
