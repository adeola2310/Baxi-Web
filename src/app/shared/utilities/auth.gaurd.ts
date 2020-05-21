import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth/auth.service';
import {Store} from '@ngrx/store';
import * as AuthActions from '../../store/actions/auth.actions';
import {AuthState} from '../../store/states/app.state';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private _store: Store<AuthState>, private _router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this._store.dispatch(new AuthActions.OpenModal({action: 'SHOW', type: 'LOGIN'}));
      this._router.navigate(['/']);
      return false;
    }
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // this._store.dispatch(new AuthActions.OpenModal({action: 'SHOW', type: 'LOGIN'}));
      // localStorage.setItem('ATTEMPTED_ROUTE', route.path);
      this._router.navigate(['/']);
      return false;
    }
  }
}
