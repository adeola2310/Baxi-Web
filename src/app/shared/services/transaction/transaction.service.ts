import { Injectable } from '@angular/core';
import { ApiReqHandlersService } from '../api-req-handlers.service';
import {API_URLS} from '../../utilities/api-urls';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private readonly apiReqHandlerService: ApiReqHandlersService) {

  }

  /**
   *
   * @param payload
   * @constructor
   */
   public LogTransactions(payload: object) {
    return this.apiReqHandlerService.post(`${API_URLS.transactionService.LOG_TRANSACTION}`, payload);
   }

  /**
   *
   * @param payload
   */
  public completeTransaction(payload: object) {
     return this.apiReqHandlerService.post(`${API_URLS.transactionService.COMPLETE_TRANSACTION}`, payload);
   }

  public completeFullTransaction(payload: object) {
    console.log("RESULTSS");
    console.log(payload);
    return this.apiReqHandlerService.put(`${API_URLS.transactionService.COMPLETE_TRANSACTION}`, payload);
  }

   public transactionHistory() {
     return this.apiReqHandlerService.get(`${API_URLS.transactionService.TRANSACTION_HISTORY}`);
   }

}
