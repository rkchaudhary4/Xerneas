import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DataComponent } from './data/data.component';
import { DashboardComponent } from './dashboard.component';
import { LoadMaterialModule } from '../material.module';
import { PeopleComponent } from './people/people.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateNameComponent } from './profile/update-name/update-name.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './editor/editor.component';
import { ProfilePictureComponent } from './profile/profile-picture/profile-picture.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DropzoneDirective } from '../directives/dropzone.directive';
import { UploaderComponent } from './uploader/uploader.component';
import { ConfirmDialogComponent } from '../utility/confirm-dialog/confirm-dialog.component';
import { MatTableComponent } from '../utility/mat-table/mat-table.component';
import { AdminDataComponent } from './data/admin-data/admin-data.component';
import { TaDataComponent } from './data/ta-data/ta-data.component';
import { ManagerDataComponent } from './data/manager-data/manager-data.component';
import { TaEditorComponent } from './editor/ta-editor/ta-editor.component';
import { ManagerEditorComponent } from './editor/manager-editor/manager-editor.component';
import { TaCsvComponent } from './editor/ta-csv/ta-csv.component';
import { ManagerCsvComponent } from './editor/manager-csv/manager-csv.component';
import { Funcs } from 'src/app/utility/funcs';
import { TableComponent } from './people/table/table.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    DashboardComponent,
    DataComponent,
    PeopleComponent,
    ProfileComponent,
    UpdateNameComponent,
    EditorComponent,
    ProfilePictureComponent,
    UploaderComponent,
    DropzoneDirective,
    ConfirmDialogComponent,
    MatTableComponent,
    AdminDataComponent,
    TaDataComponent,
    ManagerDataComponent,
    TaEditorComponent,
    ManagerEditorComponent,
    TaCsvComponent,
    ManagerCsvComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LoadMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTabsModule,
  ],
  entryComponents: [ProfilePictureComponent, ConfirmDialogComponent],
  providers: [Funcs],
})
export class DashboardModule {}
