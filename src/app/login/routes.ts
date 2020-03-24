import { LoggedInGuard } from '../auth.guard';
import { Routes } from '@angular/router';
import { LoginHomeComponent } from './login-home/login-home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const userRoutes: Routes = [
  {
    path: 'login',
    component: LoginHomeComponent,
    canActivate: [LoggedInGuard]
  },
  { path: 'signup', component: SignUpComponent, canActivate: [LoggedInGuard] },
  {
    path: 'reset_password',
    component: ResetPasswordComponent,
    canActivate: [LoggedInGuard]
  }
];
