import { EncryptionService } from '../services/encryption.service';
export class Cache {

    /**
     * Set Data to session storage
     * @param key
     * @param data
     */
    static set(key: string, data: any) {
        // console.log('data=', data);
        const encryptedData = EncryptionService.encrypt(data);
        sessionStorage.setItem(key, encryptedData);
    }

    /**
     * get data from session storage
     * @param key
     * @returns {any}
     */
    static get(key: string) {
        if (!sessionStorage.getItem(key)) {
            return null;
        }
        // if (key === 'cbsp-user-auth-token') {
        //     return = EncryptionService.decrypt(sessionStorage.getItem(key));
        // }
        return EncryptionService.decrypt(sessionStorage.getItem(key));
    }

    /**
     * Used to clear cache Data
     */
    static clear() {
        sessionStorage.clear();
    }

    /**
     * This is used to remove a data by key
     * @param key
     */
    static remove(key) {
        sessionStorage.removeItem(key);
    }

  static removeAll(key: Array<string>) {
    key.forEach((index) => {
      sessionStorage.removeItem(index);
    })
  }
    constructor() { }

}
