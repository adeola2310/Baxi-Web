import { Injectable } from '@angular/core';
import { ApiReqHandlersService } from '../api-req-handlers.service';
import { API_URLS } from '../../utilities/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

constructor(private readonly apiReqHandlerService: ApiReqHandlersService) { }

  /**
   *
   * @param payload
   * @constructor
   */
  public updateProfile(payload: object) {
  return this.apiReqHandlerService.put(`${API_URLS.profileServices.UPDATE_PROFILE}`, payload);
  }





}
