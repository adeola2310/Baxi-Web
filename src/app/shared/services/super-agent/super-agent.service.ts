import { Injectable } from '@angular/core';
import {ApiReqHandlersService} from '../api-req-handlers.service';
import { API_URLS } from '../../utilities/api-urls';


@Injectable({
  providedIn: 'root'
})
export class SuperAgentService {

  constructor(private readonly apiReqHandlerService: ApiReqHandlersService) { }

  public transactionRequery(agentReference: string) {
    return this.apiReqHandlerService.get(`${API_URLS.superAgentService.GET_SUPERAGENT}superagent/transaction/query?agentReference=${agentReference}`);
  }
}
