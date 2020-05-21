import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as AuthActions from '../../../store/actions/auth.actions';
import {AuthState} from '../../../store/states/app.state';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {TokenService} from '../../../shared/services/token.service';
import {Router} from '@angular/router';
import { UserModel } from '../../model/User';
import {CUSTOM_CONSTANTS} from "../../../shared/utilities/config";
import {NotificationService} from "../../../shared/services/notification.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  public state = {
    isLoggedIn: false,
    headerData: '',
    // firstName: '',
    headerData_img: ''
  };

  constructor(private store: Store<AuthState>, private _tokenService: TokenService, private _notificationService: NotificationService, private _router: Router) { }

  ngOnInit() {
    this.store.select('auth').subscribe(res => {
      if (res.action === 'PROFILE_IMAGE') {
        this.state.headerData_img = res.type;
      }
    });

    this.getUserInfo();
  }

  /**
   * @param {string} type
   */
  public modalAction(type: string) {
    if (type === 'LOGIN') {
      this.store.dispatch(new AuthActions.OpenModal({action: 'SHOW', type}));
    } else {
      this.store.dispatch(new AuthActions.OpenModal({action: 'SHOW', type}));
    }
  }

  public logOut() {
    this._tokenService.logoutToken();
    this.state.isLoggedIn = false;
    this._router.navigate(['/']);
    return this._notificationService.showSuccess('Successfully Logged Out', CUSTOM_CONSTANTS.DEFAULT_LOGOUT_MESSAGE);

  }


  public getUserInfo() {
    if (this._tokenService.getAuthUser()) {
      this.state.isLoggedIn = true;
      this.state.headerData = this._tokenService.getAuthUser().firstName;
      this.state.headerData_img = this._tokenService.getAuthUser().profilePhoto;
    }
    // get header state
    this.store.select('auth').subscribe(res => {
      if (res.action === 'LOGGED_IN') {
        this.state.isLoggedIn = true;
        this.state.headerData = this._tokenService.getAuthUser().firstName;
        this.state.headerData_img = this._tokenService.getAuthUser().profilePhoto;
      }
    });
  }
}
