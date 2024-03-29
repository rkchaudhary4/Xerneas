import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginHomeComponent } from './login/login-home/login-home.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { LoadMaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { WaitingBarComponent } from './utility/waiting-bar/waiting-bar.component';
import { Funcs } from './utility/funcs';
import { ServiceWorkerModule } from '@angular/service-worker';
@NgModule({
  declarations: [
    AppComponent,
    LoginHomeComponent,
    SignUpComponent,
    ResetPasswordComponent,
    WaitingBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFireModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    LoadMaterialModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
  ],
  providers: [Funcs],
  bootstrap: [AppComponent],
})
export class AppModule {}
