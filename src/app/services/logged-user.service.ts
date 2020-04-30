import { Injectable } from '@angular/core';
import { AngularFireAuth  } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/internal/operators';
import { User } from 'src/app/models/user';
import { Funcs } from 'src/app/utility/funcs';
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
    this.isAuthenticated$ = this.auth.authState.pipe(map(res => !!res));
    this.$logged = this.auth.authState.pipe(
      switchMap(user =>
        user ? this.userRef(user.uid).valueChanges() : of(null)
      ),
      catchError(() => {
        return of(null);
      })
    );
    this.$logged.subscribe(users => this.currentUser.next(users));
  };
  async SendEmailVerification() {
    return (await this.auth.currentUser).sendEmailVerification().then(() => {
      this.funcs.handleMessages('Verification E-mail has been sent to your mail');
      this.logout();
    });
  }
  signIn = (username: string, pass: string): Promise<any> =>
    this.auth
      .signInWithEmailAndPassword(username, pass)
      .then(res => {
      this.funcs.closeBar();
        if (res.user.emailVerified !== true) {
          this.logout();
          this.funcs.handleMessages('Your E-mail address is not verified');
        } else {
          let app: boolean;
          this.userRef(res.user.uid)
            .valueChanges()
            .subscribe(data => {
              app = data.approved;
              if (app === true) {
                this.router.navigate(['/dashboard']);
              } else {
                this.funcs.handleMessages('Account not activated by the admin');
                this.logout();
              }
            });
        }
      })
      .catch(err => {
        this.funcs.closeBar();
        this.funcs.handleMessages(err.message);
      });
  signup = (
    username: string,
    pass: string,
    name: string,
    roles: string
  ): Promise<void> =>
    this.auth
      .createUserWithEmailAndPassword(username, pass)
      .then(res => {
        const user = res.user;
        user
          .updateProfile({
            displayName: name
          })
          .then(() => {
            this.SendEmailVerification();
            this.funcs.closeBar();
          })
          .catch(err => {
            this.funcs.handleMessages(err.message);
          });
        this.userRef(user.uid).set({
          uid: user.uid,
          role: roles,
          displayName: name,
          email: user.email,
          approved: false,
          dpUrl: null
        });
      })
      .catch(err => {
        this.funcs.closeBar();
        this.funcs.handleMessages(err.message);
      });
  logout = (): Promise<void | boolean> =>
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(err => {
        console.log(err);
      });
  resetPassword = (email: string) => {
    this.auth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.funcs.handleMessages('Link sent to your e-mail to change password');
      })
      .catch(err => {
        this.funcs.handleMessages('Link sent to your e-mail to change password');
      });
  };

  checkLevel = (lvl: string) =>
    this.currentUser.pipe(
      map((user: User) => (user ? user.role === lvl : false))
    );

  approve = uid => {
    this.userRef(uid).update({
      approved: true
    });
  };
  disapprove = uid => {
    this.userRef(uid).update({
      approved: false
    });
  };

  changeName(name: string) {
    this.userRef(this.currentUser.getValue().uid)
      .update({
        displayName: name
      })
      .then(() => {
        this.funcs.handleMessages('Name changed successfully');
      })
      .catch(err => {
        this.funcs.handleMessages(err.message);
      });
  }

  getUsers() {
    return this.afs.collection('users', ref => ref.orderBy('role')).valueChanges();
  }

  getStudents() {
    return this.$logged.pipe(
      map(user => {
        if (user) {
          if (user.role === 'Admin')
            return this.afs.collection('students').valueChanges();
          else if (user.role === 'Manager') {
            return this.afs
              .collection(`students`, ref =>
                ref.where('manager', '==', user.uid)
              )
              .valueChanges();
          } else {
            return this.afs
              .collection(`users/${user.uid}/data`, ref =>
                ref.orderBy('time', 'desc')
              )
              .valueChanges();
          }
        }
      })
    );
  }

  constructor(
    public auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private funcs: Funcs,
  ) {
    this.init();
  }
}
