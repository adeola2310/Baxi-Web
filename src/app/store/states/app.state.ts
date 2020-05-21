import {AuthInterface} from '../reducers/auth.reducer';
import {PaymentInterFace} from '../reducers/payment.reducer';
import {IsNotFoundInterface} from '../reducers/isNotFound.reducer';

export interface AuthState {
  readonly auth: AuthInterface;
}

export interface PaymentState {
  readonly payment: PaymentInterFace;
}

export interface NotFoundState {
  readonly notFound: IsNotFoundInterface;
}
