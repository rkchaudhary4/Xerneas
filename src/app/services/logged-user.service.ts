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
      console.log('mail sent');
    });
  }
  signIn = (username: string, pass: string): Promise<any> =>
    this.afAuth.auth
      .signInWithEmailAndPassword(username, pass)
      .then(res => {
        if (res.user.emailVerified !== true) {
          this.router.navigate(['/signup']);
          console.log('Not Verified');
        } else {
          this.router.navigate(['/']);
          console.log('Verified');
        }
      })
      .catch(err => {
        console.log(err);
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
            console.log('Successfully Updated Name');
            this.SendEmailVerification();
          })
          .catch(err => {
            console.log(err);
          });
        console.log(user.uid);
        console.log('User Created Successfully');
        this.userRef(user.uid).set({
          uid: user.uid,
          role: roles,
          displayName: name,
          email: user.email
        });
      })
      .catch(err => {
        console.log(err);
      });
  logout = (): Promise<void | boolean> => this.afAuth.auth.signOut();
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.init();
  }
}
