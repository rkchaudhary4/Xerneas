import {NgModule} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const modules = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatSnackBarModule,
  FlexLayoutModule,
  MatTableModule,
  MatDialogModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: [],
})
export class LoadMaterialModule {
}
