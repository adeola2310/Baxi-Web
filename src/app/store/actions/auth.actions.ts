import {Action} from '@ngrx/store';

export enum AuthActionsTypes {
  AuthModal = '[MODAL] authModal',
  UserAuthenticated = '[LOGGED_IN] userAuth',
  ProfileImage = '[PROFILE_IMAGE] UserProfile'
}

export class OpenModal implements Action {
  readonly type = AuthActionsTypes.AuthModal;
  constructor(public payload) {}
}

export class Authentication implements Action {
  readonly type = AuthActionsTypes.UserAuthenticated;
  constructor(public payload) {}
}

export class ProfileImage implements  Action {
  readonly  type = AuthActionsTypes.ProfileImage;
  constructor(public payload) {
  }
}

export type Actions = OpenModal | Authentication | ProfileImage;
