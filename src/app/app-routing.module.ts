import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { userRoutes } from './login/routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocalUserGuard, LoggedInGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
RouterModule.forChild(userRoutes)],
exports: [RouterModule]
})
export class AppRoutingModule {
}
