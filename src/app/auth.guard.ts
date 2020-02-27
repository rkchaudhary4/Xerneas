import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedUserService } from './services/logged-user.service';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalUserGuard implements CanActivate {
  constructor(private localUserService: LoggedUserService, private router: Router){}

  canActivate(): Observable<boolean>{
    return this.localUserService.isAuthenticated$.pipe(
      map(res => {
        if(!res){
          this.router.navigate(['/login']);
        }
        return res;
      }
      )
    )
  }

}

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private localUserService: LoggedUserService, private router: Router){}

  canActivate(): Observable<boolean>{
    return this.localUserService.$logged.pipe(
      map(res => {
        if(res){
          this.router.navigate(['/']);
        }
        return !res;
      }
      )
    )
  }
}
