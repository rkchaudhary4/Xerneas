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
    this.afs.doc('users/${id}');
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
  }
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.init();
  }
}
