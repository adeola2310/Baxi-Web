import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {CUSTOM_CONSTANTS} from "../utilities/config";

@Injectable()
export class EncryptionService {
    private static KEY = CUSTOM_CONSTANTS.ENCRYPTION_KEY;

    private static CryptoJSAesJson = {
        stringify: function (cipherParams) {
            const j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64), s: null, iv: null };
            if (cipherParams.iv) {
                j.iv = cipherParams.iv.toString();
            }
            if (cipherParams.salt) {
                j.s = cipherParams.salt.toString();
            }
            return JSON.stringify(j);
        },
        parse: function (jsonStr) {
            const j = JSON.parse(jsonStr);
            const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
            if (j.iv) {
                cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
            }
            if (j.s) {
                cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
            }
            return cipherParams;
        }
    };

    /**
     * This is used to encrypt data to be saved to cache in front
     * @param data
     * @returns {any|PromiseLike<ArrayBuffer>}
     */
    static encrypt(data) {
        if (!data) {
            return null;
        }
        return CryptoJS.AES.encrypt(JSON.stringify(data), EncryptionService.KEY);
    }

     /**
      * This is used to decrypt data encrypted in cache for usage in front.
      * @param data
      * @returns {any}
      */
     static decrypt(data) {
         if (!data) {
             return null;
         }
         const decryptData = CryptoJS.AES.decrypt(data.toString(), EncryptionService.KEY);
         return JSON.parse(decryptData.toString(CryptoJS.enc.Utf8));
     }

    /**
     * used to encrypt data to be sent to api resource
     * @param data
     * @returns {string}
     */
    static getEncrypted(data) {
        if (!data) {
            return null;
        }
        return CryptoJS.AES.encrypt(JSON.stringify(data), EncryptionService.KEY, { format: EncryptionService.CryptoJSAesJson }).toString();
    }

    /**
     * Used to decrypt encrypted data sent from api resource
     * @param data
     * @returns {any}
     */
    static decryptEncrypted(data) {
        if (!data) {
            return null;
        }
        const decryptData = CryptoJS.AES.decrypt(data.toString(), EncryptionService.KEY, { format: EncryptionService.CryptoJSAesJson });
        return JSON.parse(decryptData.toString(CryptoJS.enc.Utf8));
    }

    /**
     * This is used to decode JSON WEB TOKEN
     * @param token
     * @returns {any}
     */
    static jwtDecrypt(token: any) {
        if (!token) {
            return null;
        }
        if (typeof (token) === 'object') {
            return token;
        }
        // console.log('thisToken =', token);
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        //  // console.log('thisTokenDe =', JSON.parse(window.atob(base64)));
        return JSON.parse(window.atob(base64));
    }

    constructor() { }

}
