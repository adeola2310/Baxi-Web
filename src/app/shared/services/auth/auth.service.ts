import { Injectable } from '@angular/core';
import {ApiReqHandlersService} from '../api-req-handlers.service';
import {TokenService} from '../token.service';
import {API_URLS} from '../../utilities/api-urls';
import { UserModel } from 'src/app/main/model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly apiReqHandlersService: ApiReqHandlersService,
              private _tokenService: TokenService) {

  }

  public setAuthUserToken(user: UserModel) {
    this._tokenService.setAuthUser(user);
  }

  /**
   * Checks if user is logged in
   * @returns {boolean}
   */
  public isLoggedIn(): boolean {
    return this._tokenService.isTokenLogged();
  }

  /**
   *
   * @param {object} payload
   * @return {Observable<any>}
   */
  public login(payload: object) {
    return this.apiReqHandlersService.post(`${API_URLS.authenticationService.LOGIN}`, payload);
  }

  /**
   *
   * @param {object} payload
   * @return {Observable<any>}
   */
  public signUp(payload: object) {
    return this.apiReqHandlersService.post(`${API_URLS.authenticationService.REGISTER}`, payload);
  }

  public forgotPassword(email) {
    return this.apiReqHandlersService.get(`${API_URLS.authenticationService.FORGOT_PASSWORD_BASE_URL}${email}`);

  }

  public completeForgot(data) {
    return this.apiReqHandlersService.put(`${API_URLS.authenticationService.COMPLETE}`, data);
  }

  public changePassword(data){
    return this.apiReqHandlersService.put(`${API_URLS.authenticationService.CHANGE_PASSWORD}`, data);

  }
}
