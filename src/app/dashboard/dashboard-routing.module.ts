import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataComponent } from './data/data.component';
import { LocalUserGuard, LoggedInGuard } from '../auth.guard';
import { DashboardComponent } from './dashboard.component';
import { PeopleComponent } from './people/people.component';
import { ProfileComponent } from './profile/profile.component';
import { EditorComponent } from './editor/editor.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [LocalUserGuard],
    children: [
      {
        path: '',
        component: DataComponent,
      },
      {
        path: 'people',
        component: PeopleComponent
      },
      {
        path: 'data',
        component: DataComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'editor/:id',
        component: EditorComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class DashboardRoutingModule { }
