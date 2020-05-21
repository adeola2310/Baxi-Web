import { Injectable } from '@angular/core';
import {ApiReqHandlersService} from '../api-req-handlers.service';
import {TokenService} from '../token.service';
import {API_URLS} from '../../utilities/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private readonly apiReqHandlersService: ApiReqHandlersService,
              private _tokenService: TokenService) {

  }

  /**
   *
   * @param {string} provider
   * @return {Observable<any>}
   */
  public getAllProviders(provider: string) {
    const url = provider === 'AIRTIME' ? `${API_URLS.providerService.AIRTIME_PROVIDER}/providers` : `${API_URLS.providerService.DATA_BUNDLE_PROVIDER}/providers`;
    return this.apiReqHandlersService.get(`${url}`);
  }


  /**
   *
   * @param type
   * @param plan
   */
  public getProviderPlans(type, plan?) {
    if (plan) {
      return this.apiReqHandlersService.post(`${API_URLS.billerRequestPlans.MULTICHOICE}/list`, type);
    }
    return this.apiReqHandlersService.post(`${API_URLS.providerService.DATA_BUNDLE_PROVIDER}/bundles`, {service_type: type});
  }

  /**
   *
   * @param type
   * @param payload
   */
  public getProviderRequest(type: string,  payload: any) {
    switch (type) {
      case 'STARTIMES':
        return this.apiReqHandlersService.post(`${API_URLS.billerRequestPlans.MULTICHOICE}/?service_type=${payload.type}`);
      case 'MULTICHOICE' :
        return this.apiReqHandlersService.post(`${API_URLS.billerRequestPlans.MULTICHOICE}/addons?service_type=${payload.type}&product_code=${payload.code}`);
      case 'EPINS' :
        return this.apiReqHandlersService.post(`${API_URLS.billerRequestPlans.EPINS}?service_type=${payload.type}`);
      case  'NAME_FINDER' :
        return  this.apiReqHandlersService.post(`${API_URLS.requestService.NAME_REQUEST}?service_type=${payload.type}&account_number=${payload.number}`);
      case  'VERIFY_NAME' :
        return  this.apiReqHandlersService.post(`${API_URLS.requestService.ELECTRICITY_VERIFICATION}`, payload);
    }
  }
}
