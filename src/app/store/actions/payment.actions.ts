import {Action} from '@ngrx/store';


export enum PaymentActionTypes {
  triggerPayment = '[PAYMENT] trigger',
  paymentDone = ' [PAYMENT] done'
}

export class MakePayment implements Action {
  readonly type = PaymentActionTypes.triggerPayment;
  constructor(public payload) {}
}

export class PaymentDone implements Action {
  readonly type = PaymentActionTypes.paymentDone;
  constructor(public payload) {
  }
}

export type Actions = MakePayment | PaymentDone;
