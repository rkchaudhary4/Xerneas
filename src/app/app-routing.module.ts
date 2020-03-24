import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { userRoutes } from './login/routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
RouterModule.forChild(userRoutes),
RouterModule.forChild([
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
])],
exports: [RouterModule]
})
export class AppRoutingModule {
}
