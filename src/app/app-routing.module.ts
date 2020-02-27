import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginHomeComponent } from './login/login-home/login-home.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { userRoutes } from './login/routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocalUserGuard, LoggedInGuard } from './auth.guard';

const routes: Routes = [
  {path: '',
    component: DashboardComponent,
    canActivate: [LocalUserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
RouterModule.forChild(userRoutes)],
exports: [RouterModule]
})
export class AppRoutingModule {
}
