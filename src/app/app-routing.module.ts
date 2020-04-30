import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { userRoutes } from './login/routes';
import { LocalUserGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
RouterModule.forChild(userRoutes),
RouterModule.forChild([
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
])],
exports: [RouterModule]
})
export class AppRoutingModule {}
