import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedUserService } from './services/logged-user.service';
import { map } from 'rxjs/internal/operators';
import { StudentDataService } from './services/student-data.service';

@Injectable({
  providedIn: 'root',
})
export class LocalUserGuard implements CanActivate {
  constructor(
    private localUserService: LoggedUserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.localUserService.isAuthenticated$.pipe(
      map((res) => {
        if (!res) {
          this.router.navigate(['/login']);
        }
        return res;
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
  constructor(
    private localUserService: LoggedUserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.localUserService.$logged.pipe(
      map((res) => {
        if (res) {
          this.router.navigate(['/dashboard']);
        }
        return !res;
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class EditorGuard implements CanActivate {
  uid: string;
  role: string;
  constructor(
    private LocalUserService: LoggedUserService,
    private student: StudentDataService,
    private router: Router
  ) {
    this.LocalUserService.$logged.subscribe((res) => {
      if (res) {
        this.uid = res.uid;
        this.role = res.role;
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.paramMap.get('id');
    return this.student
      .studentRef(id)
      .valueChanges()
      .pipe(
        map((res) => {
          if (!res) {
            this.router.navigate(['/dashboard/data']);
            return false;
          }
          if (this.role === 'Admin') { return true; }
          if (this.role === 'Manager') {
            if (res.manager === this.uid) { return true; }
            else {
              this.router.navigate(['/dashboard/data']);
              return false;
            }
          }
          if (this.role === 'Teaching Assistant (TA)') {
            if (res.tas.includes(this.uid)) {
              const i = res.comments.findIndex((e) => e.ta === this.uid);
              if (i > -1) {
                this.router.navigate(['/dashboard/data']);
                return false;
              } else { return true; }
            } else {
              this.router.navigate(['/dashboard/data']);
              return false;
            }
          }
        })
      );
  }
}
