import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {AuthState} from '../../../store/states/app.state';
import {passwordPreview, triggerModalOrOverlay} from '../../utilities/helper';
import * as AuthActions from '../../../store/actions/auth.actions';
import {FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import {removeSpaces} from '../../directives/common-form-directive';
import {NotificationPosition, NotificationService} from '../../services/notification.service';
import {AuthService} from '../../services/auth/auth.service';
import {CUSTOM_CONSTANTS} from '../../utilities/config';
import { BaseResponseModel } from '../../../main/model/BaseResponseModel';
import { BroadcastNotificationService } from '../../services/app-service/broadcast-notification-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  public state = {
    loader: false
  };

  public details = {
    email: null,
    otp: null,
    password: null,
    confirmPassword: null
  }
  public loaders = {
    showToken: false,
    showLogin: false,
    showTokenMessage: true
  }

  public loginFormGroup: FormGroup;

  static loginFormControl = () => {
    return {
      email: ['', [Validators.required, Validators.email, removeSpaces]],
      password: ['', [Validators.required, removeSpaces]],
      rememberMe: [false]
    };
  }


  public passwordToggle = (ele) => {
    return passwordPreview(ele);
  }


  constructor(private _store: Store<AuthState>,
              private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _router: Router,
              private _broadcastNotificationService : BroadcastNotificationService,
              private _notificationService: NotificationService) {
    this.loginFormGroup = _formBuilder.group(LoginModalComponent.loginFormControl());
  }

  ngOnInit() {
   this._store.select('auth').subscribe(res => {
     if (res.action === 'SHOW' && res.type === 'LOGIN') {
      triggerModalOrOverlay(res.action, 'loginModal');
     }
   });
  }

  /**
   *
   * @param {string} type
   */
  public openModal(type: string): void {
    triggerModalOrOverlay('HIDE', 'loginModal'); // first hide the current modal
    if (type === 'SIGN_UP') {
      this._store.dispatch(new AuthActions.OpenModal({action: 'SHOW', type}));
    } else {
      triggerModalOrOverlay('SHOW', 'forgotPasswordModal');
    }
  }

  public login(): void {

    this.state.loader = true;

    this._authService.login(this.loginFormGroup.value).subscribe(
      (res: BaseResponseModel) => {
        this.state.loader = false;
        console.log(res);
        if (res.statusCode == '0') {
            this._authService.setAuthUserToken(res.data);
            triggerModalOrOverlay('HIDE', 'loginModal');
            this._store.dispatch(new AuthActions.Authentication({action: 'LOGGED_IN', type: ''}));
            this._broadcastNotificationService.login(res);
            return this._notificationService.showSuccess(CUSTOM_CONSTANTS.SUCCESSFULLY_LOGIN, CUSTOM_CONSTANTS.DEFAULT_SUCCESS_MESSAGE);
         }
        return this._notificationService.showError( CUSTOM_CONSTANTS.DEFAULT_LOGIN_MESSAGE);
      }, err => {
        this.state.loader = false;
        this._notificationService.showError('Error occurred!', err, err.status !== 422 ? CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE : err.error.message);
      }
    );

  }

  public setPassword() {
    this.state.loader = true;
    this._authService.forgotPassword(this.details.email).subscribe(
      (res) => {
        this.state.loader = false;
        console.log(res);
        return this.loaders.showToken = true;
      },
      err => {
        this.state.loader = false;
        this._notificationService.showError('Error occurred!', err, err.status !== 422 ? CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE : err.error.message);
      }
    );

  }

  public completeReset(){
    console.log(this.details);
    this.state.loader = true;
    this._authService.completeForgot(this.details).subscribe(
      (res) => {
        this.state.loader = false;
        console.log(res);
        this._notificationService.showSuccess(CUSTOM_CONSTANTS.PASSWORD_SUCCESS_MESSAGE);
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(function(){ location.reload(); }, 2000);
      },
      err => {
        this.state.loader = false;
        this._notificationService.showError('Error occurred!', err, err.status !== 422 ? CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE : err.error.message);
      }
    );

  }

}
