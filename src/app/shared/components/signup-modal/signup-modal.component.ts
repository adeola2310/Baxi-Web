import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {AuthState} from '../../../store/states/app.state';
import {passwordPreview,triggerModalOrOverlay} from '../../utilities/helper';
import * as AuthActions from '../../../store/actions/auth.actions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {compareValidator, removeSpaces} from '../../directives/common-form-directive';
import {CountryISO, SearchCountryField, TooltipLabel} from 'ngx-intl-tel-input';
import {AuthService} from '../../services/auth/auth.service';
import {NotificationService} from '../../services/notification.service';
import {CUSTOM_CONSTANTS} from '../../utilities/config';
import {Router} from "@angular/router";
import {error} from "util";

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss']
})
export class SignupModalComponent implements OnInit {

  separateDialCode = true;

  SearchCountryField = SearchCountryField;

  TooltipLabel = TooltipLabel;

  CountryISO = CountryISO;

  preferredCountries: CountryISO[] = [CountryISO.Nigeria, CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  public state = {
    loader: false
  };

  public signUpFormGroup: FormGroup;

  static signUpFormControl = () => {
    return {
      firstName: ['', [Validators.required]],
      // lastName: ['', [Validators.required, removeSpaces]],
      email: ['', [Validators.email, Validators.required, removeSpaces]],
      phone: ['', [Validators.required]],
      password: ['',[Validators.required]],
      confirmPassword: ['', [Validators.required, removeSpaces, compareValidator('password')]],
      referrer: ['']
    };
  }


  public passwordToggle = (ele) => {
    return passwordPreview(ele);
  }

  constructor(private _store: Store<AuthState>,
              private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _router: Router,
              private _notificationService: NotificationService) {
    this.signUpFormGroup = _formBuilder.group(SignupModalComponent.signUpFormControl());
  }

  ngOnInit() {
    this._store.select('auth').subscribe(res => {
      if (res.action === 'SHOW' && res.type === 'SIGN_UP') {
        triggerModalOrOverlay(res.action, 'signUpModal');
      }
    });
  }

  /**
   *
   * @param {string} type
   */
  public openModal(type: string): void {
    triggerModalOrOverlay('HIDE', 'signUpModal'); // first hide the current modal
    this._store.dispatch(new AuthActions.OpenModal({actions: 'SHOW', type}));
  }



  public signUpForm(): void {
    console.log(this.signUpFormGroup.value);
    const formValue = this.signUpFormGroup.value;
    formValue.telephone = formValue.phone.nationalNumber;
    this.state.loader = true;
    this._authService.signUp(formValue).subscribe(
      res => {
        console.log(res);
        this.state.loader = false;
        if (res.status) {
          this.signUpFormGroup.reset();
          triggerModalOrOverlay('HIDE', 'signUpModal'); // first hide the current modal
          return this._notificationService.showSuccess('Account Created Successfully', CUSTOM_CONSTANTS.SUCCESSFULLY_REGISTER);
          // tslint:disable-next-line:only-arrow-functions
          setTimeout(function(){ location.reload(); }, 2000);

        } else  {
          triggerModalOrOverlay('HIDE', 'signUpModal'); // first hide the current modal
          return this._notificationService.showError('Email already exist', CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE);
        }
      }, err => {
        this.state.loader = false;
        return this._notificationService.showError('Error in signing up', CUSTOM_CONSTANTS.DEFAULT_SIGNUP_MESSAGE);
        console.log(err);
        // this._notificationService.showError('Error occurred!', error, error.status !== 422 ? CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE : error.error.message);
      }
    );
  }

}
