import { CUSTOM_CONSTANTS } from './config';
import { EncryptionService } from '../services/encryption.service';

export class Cookie {

  /**
   * @param cname
   * @param cvalue
   * @param ex
   */
  static set(cname: string, cvalue: any, ex: any) {
    const encryptedUser = EncryptionService.encrypt(cvalue);
    const date = new Date();
    date.setTime(date.getTime() + (ex.expires * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();

    document.cookie = cname + '=' + encryptedUser + ';' + expires + ';path=/';
  }

  /**
   *
   * @param cname
   */
  static remove(cname: string) {
    if (typeof (Storage) !== 'undefined') {
      const d = new Date();
      d.setTime(d.getTime() - (12 * 24 * 60 * 60 * 1000000));
      const expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + undefined + ';' + expires + ';path=/';
    }
  }

  /**
   *
   * @param cname
   */
  static prepareGet(cname: string) {
    if (typeof (Storage) !== 'undefined') {
      const name = cname + '=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length) || undefined;
        }
      }
      return '';
    } else {
      return 0;
    }
  }

  /**
   *
   * @param cname
   */
  static get(cname: string) {
    if (cname === CUSTOM_CONSTANTS.APP_VARIABLE && !EncryptionService.decrypt(Cookie.prepareGet(CUSTOM_CONSTANTS.APP_VARIABLE))) {
      return null;
    }
    return EncryptionService.jwtDecrypt(EncryptionService.decrypt(Cookie.prepareGet(cname)));
    // return Cookie.prototype.prepareGet(cname)
  }

  static getToken() {
    if (!Cookie.prepareGet(CUSTOM_CONSTANTS.APP_VARIABLE)) {
      return null;
    }
    return EncryptionService.decrypt(Cookie.prepareGet(CUSTOM_CONSTANTS.APP_VARIABLE));
    // return Cookie.prototype.prepareGet('appName');
  }
}
