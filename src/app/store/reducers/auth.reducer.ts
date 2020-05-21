import * as AuthActions from './../actions/auth.actions';
import {AuthActionsTypes} from '../actions/auth.actions';


export interface AuthInterface {
  action: string;
  type?: string;
}

const modalInitialState: AuthInterface = {
  action: '',
  type: ''
};

export function authReducer(state: AuthInterface = modalInitialState, action: AuthActions.Actions) {

  switch (action.type) {
    case AuthActionsTypes.AuthModal :
      return  {...state, ...action.payload};
    case AuthActionsTypes.UserAuthenticated :
      return {...state, ...action.payload};
    case AuthActionsTypes.ProfileImage:
      return  {...state, ...action.payload};
    default :
      return state;
  }
}
