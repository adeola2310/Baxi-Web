import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {TokenService} from './token.service';
import {NotificationService} from './notification.service';
import {environment as env} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private _tokenService: TokenService,
              private _notification: NotificationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const setHeaders = {
      Accept: 'Application/json',
      'Content-Type': 'Application/json',
      'x-api-key': `${env.API_KEY}`
    };


    if (req.headers['Content-Type'] !== 'application/json') {
      delete setHeaders['Content-Type'];
    }

    let updatedRequest = req;

    // let guest have access
    updatedRequest = req.clone({
      headers: req.headers.set('x-api-key', `${env.API_KEY}`)
    });


    if (this._tokenService.isTokenLogged()) {
      updatedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this._tokenService.getAuthUserToken()}`)
        .set('x-api-key', `${env.API_KEY}`)
      });
    }
    // console.log('before going: ', updatedRequest);

    return next.handle(updatedRequest).pipe(
      tap(
        (res) => {
          // console.log('REQUEST', res);
        },
        (err) => {
          if (err instanceof HttpErrorResponse) {}
        }
      )
    );
  }
}
