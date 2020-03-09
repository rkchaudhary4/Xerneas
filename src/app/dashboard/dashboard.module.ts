import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DataComponent } from './data/data.component';
import { DashboardComponent } from './dashboard.component';
import { LoadMaterialModule } from '../material.module';
import { PeopleComponent } from './people/people.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateNameComponent } from './profile/update-name/update-name.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    DataComponent,
    PeopleComponent,
    ProfileComponent,
    UpdateNameComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LoadMaterialModule,
    FormsModule
  ]
})
export class DashboardModule { }
