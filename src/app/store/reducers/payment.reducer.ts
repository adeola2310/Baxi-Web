import * as PaymentActions from '../actions/payment.actions';
import {PaymentActionTypes} from '../actions/payment.actions';

export interface PaymentInterFace {
  action: string;
  paymentObject?: PaymentObject;
  data?: any;
}

/**
 * Payment Object
 */
interface PaymentObject {
  ref: string;
  amount?: string;
  email?: string;
  title?: string;
  phone?: string;
}

const initialState: PaymentInterFace = {
  action: '',
  paymentObject : {
    ref: '',
    amount: '',
    email: '',
    title: '',
    phone: ''
  }
};


export function paymentReducer(state: PaymentInterFace = initialState, action: PaymentActions.Actions) {

  switch (action.type) {
    case PaymentActionTypes.triggerPayment :
      return {...state, ...action.payload};
    case PaymentActionTypes.paymentDone :
      return  {...state, ...action.payload};
    default :
      return state;
  }
}
