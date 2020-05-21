import {Injectable} from '@angular/core';
import {Cookie} from '../utilities/cookie';
import {Session} from '../utilities/session';
import {CUSTOM_CONSTANTS} from '../utilities/config';
import { StorageMap } from '@ngx-pwa/local-storage';
import {UserModel} from '../../main/model/User';


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private storage: StorageMap) {
  }

  public isTokenLogged(): boolean {
    return !!this.getAuthUser();
  }

  public setAuthUser(user: UserModel): void {
    Session.set(CUSTOM_CONSTANTS.APP_VARIABLE, user);
    // localStorage.setItem('key', JSON.stringify(user));
    // console.log(token + "setAuthToken()")
    // this.storage.set(CUSTOM_CONSTANTS.APP_TOKEN, token);
  }

  public getAuthUser(): any {
    return Session.get(CUSTOM_CONSTANTS.APP_VARIABLE);
    // localStorage.getItem(CUSTOM_CONSTANTS.APP_VARIABLE);
  }

  /**
   *
   * @return {any}
   */
  public getAuthUserToken(): any {
    return Session.get(CUSTOM_CONSTANTS.APP_VARIABLE).token || Cookie.getToken();
  }

  /**
   *
   */
  private removeAuthUser(): void {
    // this.storage.clear()
    Cookie.remove(CUSTOM_CONSTANTS.APP_VARIABLE);
    Session.remove(CUSTOM_CONSTANTS.APP_VARIABLE);
  }

  /**
   *
   */
  public logoutToken(): void {
    this.removeAuthUser();
    Session.clear();
    localStorage.removeItem('user');
    // localStorage.clear();
  }
}
