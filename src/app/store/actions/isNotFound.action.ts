import {Action} from '@ngrx/store';

export enum Has404Type {
  billerNotFound = '[404] biller',
  pageNotFound = ' [404] page'
}

export class BillerIsNotFound implements Action {
  readonly type = Has404Type.billerNotFound;
  constructor(public payload) {}
}

export type Actions = BillerIsNotFound;
