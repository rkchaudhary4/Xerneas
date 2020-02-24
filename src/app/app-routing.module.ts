import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginHomeComponent } from './login/login-home/login-home.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';

const routes: Routes = [
  {path: '',
    component: LoginHomeComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule {
}
