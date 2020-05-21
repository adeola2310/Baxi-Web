import {TransactionService} from '../services/transaction/transaction.service';
import {RequestService} from '../services/request/request.service';
import {Observable} from 'rxjs';

export class PaymentVerificationHelper {
  constructor(public requestService: RequestService) {
  }

  /**
   *
   * @param persalData
   */
  public requestBus(persalData: any) {
    console.log(persalData);
    const paymentPayload = persalData.payload;
    const requestData = persalData.data;

    switch (paymentPayload.provider) {

      case 'AIRTIME':
        return this.requestAirtime(paymentPayload, requestData);
      case 'DATA':
        return  this.requestData(paymentPayload, requestData);
      case 'ELECTRICITY':
        return this.electricity(paymentPayload, requestData);
      case 'EPIN':
        return  this.epin(paymentPayload, requestData);
      default :
        return this.cableTv(paymentPayload, requestData);
    }
  }

  /**
   *
   * @param payload
   * @param data
   */
  private requestAirtime(payload: any, data: any): Observable<any> {
    const rPayload = {
      phone: payload.phone,
      amount: payload.amount,
      service_type: data.biller.billerName.toLowerCase(),
      plan: 'prepaid',
      agentId: '207',
      agentReference: payload.ref
    };
    return this.requestService.requestAirtime(rPayload);
  }

  /**
   *
   * @param payload
   * @param data
   */
  private requestData(payload: any, data: any): Observable<any> {
    const rPayload = {
      phone: payload.phone,
      amount: payload.amount,
      service_type: payload.serviceType,
      datacode: payload.code,
      plan: 'prepaid',
      agentId: '207',
      agentReference: payload.ref
    };
    return this.requestService.requestData(rPayload);
  }

  /**
   *
   * @param payload
   * @param data
   */
  private electricity(payload: any, data): Observable<any> {
    const rPayload = {
      amount: payload.amount,
      account_number: payload.account_number,
      phone: payload.phone,
      service_type: payload.service_type || data.biller.billerName.toLowerCase(),
      agentId: '207',
      agentReference: payload.ref
    };
    return this.requestService.requestElectricity(rPayload);
  }

  /**
   *
   * @param payload
   * @param data
   */
  private cableTv(payload: any, data): Observable<any> {
    const rPayload = {
      smartcard_number: payload.cardNumber,
      total_amount: payload.amount,
      product_code: payload.productCode,
      product_monthsPaidFor: payload.productDuration,
      addon_code: payload.addonCode,
      addon_monthsPaidFor: payload.addonDuration,
      service_type: payload.service_type || data.biller.billerName.toLowerCase(),
      agentId: '207',
      agentReference: payload.ref
    };
    return this.requestService.requestMultiChoice(rPayload);
  }

  /**
   *
   * @param payload
   * @param data
   */
  private epin(payload: any, data): Observable<any> {
    const rPayload = {
      numberOfPins: payload.numberOfPin,
      pinValue: payload.pinValue,
      amount: payload.amount,
      service_type: payload.service_type || data.biller.billerName.toLowerCase(),
      agentId: '207',
      agentReference: payload.ref
    };
    console.log(rPayload);
    return this.requestService.requestEpin(rPayload);
  }
}
