import { Injectable } from '@angular/core';
import {ApiReqHandlersService} from '../api-req-handlers.service';
import {API_URLS} from '../../utilities/api-urls';

@Injectable({
  providedIn: 'root'
})
export class BillersService {

  constructor(private readonly apiReqHandlersService: ApiReqHandlersService) { }


  /**
   *
   */
  public getAllBillers() {
    return this.apiReqHandlersService.get(`${API_URLS.billersService.GET_BILLERS}/services/list`);
  }

  /**
   *
   */
  public getAllBillerProviders() {
    return this.apiReqHandlersService.get(`${API_URLS.billersService.GET_BILLERS}/provider/all`);
  }

  /**
   *
   * @return {Observable<any>}
   */
  public getAllBillerCategories() {
  return this.apiReqHandlersService.get(`${API_URLS.billersService.GET_BILLERS}/category/all`);
}

  /**
   *
   * @param {object} payload
   * @return {Observable<any>}
   */
  public getBillersByCategory(payload: object) {
    return this.apiReqHandlersService.post(`${API_URLS.billersService.GET_BILLERS}/services/category`, payload);
  }

}
