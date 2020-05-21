import { EncryptionService } from '../services/encryption.service';

export class Session {
  /**
   * @description set data from sessionStorage and also encrypt it
   * @param key
   * @param data
   */
  static set(key: string, data: any) {
    const encryptedData = EncryptionService.encrypt(data);
    sessionStorage.setItem(key, encryptedData);
  }

  /**
   * @description get data from sessionStorage and also decrypt it
   * @param key
   * @returns any
   */
  static get(key: string): any {
    if (!sessionStorage.getItem(key)) {
      return null;
    }

    return EncryptionService.decrypt(sessionStorage.getItem(key));
  }

  /**
   * @description clear all data from sessionStorage
   */
  static clear(): void {
    sessionStorage.clear();
  }

  /**
   * @description remove an item from sessionStorage
   * @param key
   */
  static remove(key: string) {
    sessionStorage.removeItem(key);
  }
}
