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
    DropzoneDirective
  ],
  imports: [
  CommonModule,
    DashboardRoutingModule,
    LoadMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule
  ],
  entryComponents: [ProfilePictureComponent]
})
export class DashboardModule { }
