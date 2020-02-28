import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment} from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginHomeComponent } from './login/login-home/login-home.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoadMaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginHomeComponent,
    SignUpComponent,
    ResetPasswordComponent,
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFireModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardModule,
    LoadMaterialModule
  ],
  providers: [SignUpComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
