import { Injectable } from '@angular/core';
import {ApiReqHandlersService} from '../api-req-handlers.service';
import {TokenService} from '../token.service';
import {API_URLS} from '../../utilities/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  constructor(private readonly apiReqHandlersService: ApiReqHandlersService,
              private _tokenService: TokenService) {

  }

  /**
   *
   * @return {Observable<any>}
   */
  public getAirtimeProviders() {
    return this.apiReqHandlersService.get(`${API_URLS.providerService.AIRTIME_PROVIDER}/providers`);
  }
}
