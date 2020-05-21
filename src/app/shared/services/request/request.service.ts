import { Injectable } from '@angular/core';
import { ApiReqHandlersService } from '../api-req-handlers.service';
import { API_URLS } from '../../utilities/api-urls';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private readonly apiReqHandlerService: ApiReqHandlersService) { }

  /**
   *
   * @param payload
   */
  public requestAirtime(payload: object) {
    return this.apiReqHandlerService.post(`${API_URLS.requestService.AIRTIME_REQUEST}`, payload);
  }

  /**
   *
   * @param payload
   */
  public requestData(payload: object) {
    return this.apiReqHandlerService.post(`${API_URLS.requestService.DATA_REQUEST}`, payload);
  }

  /**
   *
   * @param payload
   */
  public requestElectricity(payload: object) {
    return this.apiReqHandlerService.post(`${API_URLS.requestService.ELECTRICITY_REQUEST}`, payload);
  }

  /**
   *
   * @param payload
   */
  public requestMultiChoice(payload: object) {
    return this.apiReqHandlerService.post(`${API_URLS.requestService.MULTICHOICE_REQUEST}`, payload);
  }

  /**
   *
   * @param payload
   */
  public requestEpin(payload: object) {
    return this.apiReqHandlerService.post(`${API_URLS.requestService.EPIN_REQUEST}`, payload);
  }

}
