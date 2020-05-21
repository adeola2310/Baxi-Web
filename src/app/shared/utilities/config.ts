import { environment as env } from './../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';


export class Config {
  public static BASE_URL = env.BASE_URL;

  public headers: any = {};

  /**
   * setHeaders
   * @description this is use to set request header if it a json request
   */
  public setHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
    return headers;
  }

}

/**
 *
 */
export const CUSTOM_CONSTANTS = {
  ENCRYPTION_KEY: 'U2FsdGVkX19LHO5WvYAftSALKstND6fksYlNY6dQdOnJhT0R61gnfInGTIoaMhOPtZB+d8L59FhFJr0O0JNzubvCaDe/LshmdppueZjQecbxEK6puoM8udp2r4BN+/2OAyBOZ+gug08YnPw4TUKOuvx5EfSTHI0iRLhpvA2W7ZJ36o2kEesK8/VNM95gbtKKM+/tiYBouCW59V1yKjxsnQMh684NXnicgdnUqXz/RgNZCMsQ/K3eDnYTqcHc0wUHiac1ja2vyNLhPH4ko4iH9HS7aWQ56OT+4vAJFplpr5FzlsOnTyjCsiyRVDiJ8DsqutpK/KpNMHywMGRwDoFOtqi6+Q+g7/HLumzPwFu1ThjmiNUXfoDvekFrX11KOQDILJL19UBlbKrQbWKQ4WDzzHFsdgG22gSk/nq6ZT1FB4nk6OIAz9u845127Y3fWI9RnfYB43ap+aq9aEfMF4PDo4Qi5MqL4yLWyD1tdyxO5ew89OW/sD3pFFGYfDG+V6olLOkuClXRSqzMBVW612kvNAyVjdRlf3UKG99bMpmRX9JBWk7PMNqflcSSY+ahAckQVsJNrl8lVNDWGrnNlyJSC6YbclBPzBhyn1O1B3/gUuMmHByDVEiVkSc0rFHmuOLJNNzwbrbPvPt3/PGViCAZWvwFdLKs+kshXlaM3Ka9gYKUvUkU8ScOm1oZWCQOBNYBFfVneHnegOjEryBmbfeCANCOsiyGmduMMLrS27csScB5Rp2KX2RMdSG/o1qstnjNaKNqGdGb+hUMnEFfRa2WPARlXqrDcLNyvr5Pss7DdvJ7teaYwTUKw9NN7LNxzC/GxNKfdZ/zmXbUcwFjaa1kQA==',
  DEFAULT_ERROR_MESSAGE: 'Error',
  DEFAULT_SIGNUP_MESSAGE: 'Email already taken',
  DEFAULT_LOGIN_MESSAGE: 'Wrong email and/or password',
  DEFAULT_SUCCESS_MESSAGE: 'Success',
  DEFAULT_LOGOUT_MESSAGE: 'Success',
  PASSWORD_CHANGE_SUCCESS: 'password successfully changed',
  PASSWORD_SUCCESS_MESSAGE: 'Password successfully set, proceed to login',
  FILE_UPLOAD: 'Success',
  UNAUTHENTICATED: 'Unauthenticated',
  APP_VARIABLE: 'BAXI_PAY',
  APP_TOKEN: 'BAXI_PAY_TOKEN',
  INVALID_DATA: 'The given data is invalid',
  ITEMS_PER_PAGE: 20,
  // RAVE_PUBLIC_KEY: 'FLWPUBK-721b317f8d0ae0f72eb4efb1e7e5ab8a-X',
  APP_USER_DETAILS : 'BAXI_USER',
  // RAVE_PUBLIC_KEY: 'FLWPUBK_TEST-9ed3285854cd7312c627c8428914eee0-X', // Flutter wave test
  RAVE_PUBLIC_KEY : 'FLWPUBK-721b317f8d0ae0f72eb4efb1e7e5ab8a-X',
  SUCCESSFULLY_REGISTER : 'Registration successful',
  SUCCESSFULLY_LOGIN : 'Login successful',
};

/**
 *
 */


