import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/internal/operators';
import { User } from '../models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {
  currentUser: BehaviorSubject<User>;
  $logged: Observable<User>;
  isAuthenticated$: Observable<boolean>;
  role: Observable<string>;
  public userRef = (id: string): AngularFirestoreDocument<User> =>
    this.afs.doc(`users/${id}`);
  init = (): void => {
    this.currentUser = new BehaviorSubject<User>(null);
    this.isAuthenticated$ = this.afAuth.authState.pipe(map(res => !!res));
    this.$logged = this.afAuth.authState.pipe(
      switchMap(user =>
        user ? this.userRef(user.uid).valueChanges() : of(null)
      ),
      catchError(err => {
        return of(null);
      })
    );
    this.$logged.subscribe(users => this.currentUser.next(users));
  };
  SendEmailVerification() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.snackbar.open('Verification E-mail has been sent to your mail', '', {
        duration: 2000
      })
      this.logout();
    });
  }
  signIn = (username: string, pass: string): Promise<any> =>
    this.afAuth.auth
      .signInWithEmailAndPassword(username, pass)
      .then(res => {
        if (res.user.emailVerified !== true) {
          this.logout();
          this.snackbar.open('Your E-mail address is not verified', '', {
            duration: 2500
          });
        } else {
          let app: boolean;
          this.userRef(res.user.uid).valueChanges().subscribe(data => {
            app = data.approved;
          if( app === true) { this.router.navigate(['/']); }
          else {
            this.snackbar.open('Account not activated by the admin', '' , {
              duration: 2000
            });
            this.logout();
          }
          });
        }
      })
      .catch(err => {
        this.snackbar.open(err.message, '', {
          duration: 2000
        });
      });
  signup = (
    username: string,
    pass: string,
    name: string,
    roles: string
  ): Promise<void> =>
    this.afAuth.auth
      .createUserWithEmailAndPassword(username, pass)
      .then(res => {
        const user = res.user;
        user
          .updateProfile({
            displayName: name
          })
          .then(() => {
            this.SendEmailVerification();
          })
          .catch(err => {
            this.snackbar.open(err.message, '', {
              duration: 2000
            });
          });
        this.userRef(user.uid).set({
          uid: user.uid,
          role: roles,
          displayName: name,
          email: user.email,
          approved: false
        });
      })
      .catch(err => {
        this.snackbar.open(err.message, '', {
          duration: 2000
        });
      });
  logout = (): Promise<void | boolean> =>
    this.afAuth.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(err => {
        console.log(err);
      });
  resetPassword = (email: string) => {
    this.afAuth.auth
      .sendPasswordResetEmail(email)
      .then(res => {
        this.router.navigate(['/login']);
      })
      .catch(err => {
        this.snackbar.open(err.message, '', {
          duration: 2000
        });
      });
  };
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.init();
  }
}
