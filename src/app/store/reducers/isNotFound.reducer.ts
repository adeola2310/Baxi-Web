import * as NotFoundActions from '../actions/isNotFound.action';

export interface IsNotFoundInterface {
  type: string;
  serviceName?: string;
  category?: string;
}

const initialState: IsNotFoundInterface = {
  type: '',
};

export function notFound(state: IsNotFoundInterface = initialState, action: NotFoundActions.Actions) {

  console.log(state);
  // switch (action.type) {
  //   case PaymentActionTypes.triggerPayment :
  //     return {...state, ...action.payload};
  //   case PaymentActionTypes.paymentDone :
  //     return  {...state, ...action.payload};
  //   default :
  //     return state;
  // }
}

