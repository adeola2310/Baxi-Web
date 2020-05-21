import {authReducer} from './auth.reducer';
import {paymentReducer} from './payment.reducer';
import {notFound} from './isNotFound.reducer';

export const reducers = {
  auth: authReducer,
  payment: paymentReducer,
  notFound
};
