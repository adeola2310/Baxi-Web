import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../../../shared/services/notification.service';
import {DomSanitizer} from '@angular/platform-browser';
import { ProfileService } from 'src/app/shared/services/profile-service/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {CUSTOM_CONSTANTS} from '../../../shared/utilities/config';
import {Store} from '@ngrx/store';
import {AuthState} from '../../../store/states/app.state';
import * as AuthActions from '../../../store/actions/auth.actions';
import {triggerModalOrOverlay} from "../../../shared/utilities/helper";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  profileForm: FormGroup;
  submitted = false;
  public state = {
    loader: false,
    showSuccess: false
  };

  public changepassword = {
    currentPassword: null,
    password: null,
    confirmPassword: null,
  }


  public imageFile: any = '';
  public imageData: string;
  public active = false;

  constructor(private _notificationService: NotificationService,
              private _authService: AuthService,
              private _router: Router,
              public safeUrl: DomSanitizer, private _profile: ProfileService,
              private _tokenService: TokenService, private formBuilder: FormBuilder,
              private _store: Store<AuthState> ) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      image: ['', Validators.length]
    });
    this.getProfileData();

  }
   // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  onSubmit() {
    let strRep: string;
    if (this.imageFile) {
      strRep = this.imageFile.includes('data:image/png') ? 'data:image/png;base64,' :  'data:image/jpeg;base64,';
    }
    const profileRequest = {
      isProfilePhotoChanged: 'true',
      fullName: this.f.firstName.value + ' ' + this.f.lastName.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      email: this.f.email.value,
      gender: this. f.gender.value,
      phoneNumber: this.f.phoneNumber.value,
      profilePhoto: this.imageFile.replace(strRep, '')
    };

    this.submitted = true;
    if (this.profileForm.invalid) {
        this._notificationService.showWarning(this.profileForm.status);
        // this.f.firstName.setValue('freedom');
        console.log(this.f.firstName.value);
        return;
      }
    this.updateProfile(profileRequest);
  }
  /**
   *
   * @param event
   */
  public uploadImage(event: any): void {
    const file = event.target.files[0];
    const fileType = file.type;
    const validImageTypes = ['image/jpeg', 'image/png'];
    if (!validImageTypes.includes(fileType)) {
      // invalid file type code goes here.
      return this._notificationService.showError('The file type you choose is not allowed!');
    }
    if (file.size > 2000000) {
      return this._notificationService.showError('The image you selected is too large!');
    }
    const reader = new FileReader();

    if (event.target.files && event.target.files.length > 0) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageFile = reader.result;
        // console.log(reader.result.toString().replace('data:image/png;base64,', ''));
        this._store.dispatch(new AuthActions.ProfileImage({action: 'PROFILE_IMAGE', type: reader.result}));
      };
    }
  }

  private getProfileData() {
    const userData = this._tokenService.getAuthUser();
    if (this._tokenService.getAuthUser()) {
      this.f.firstName.setValue(userData.firstName);
      this.f.lastName.setValue(userData.lastName);
      this.f.email.setValue(userData.email);
      this.f.phoneNumber.setValue(userData.phoneNumber);
      this.f.gender.setValue(userData.gender);
    }
    this.imageFile = JSON.parse(localStorage.getItem('USER_PROFILE')) ?
      JSON.parse(localStorage.getItem('USER_PROFILE')).profilePhoto || this._tokenService.getAuthUser().profilePhoto :
      this._tokenService.getAuthUser().profilePhoto;
  }

  /**
   *
   * @param payload
   */
  private updateProfile(payload: any) {
    this.state.loader = true;
    this._profile.updateProfile(payload).subscribe(res => {
      this.state.loader = false;
      this.updateProfileRes(res.data);
      this._notificationService.showSuccess('Profile Updated Successfully', CUSTOM_CONSTANTS.DEFAULT_SUCCESS_MESSAGE);
    }, err => {
      this.state.loader = false;
      this._notificationService.showWarning(err);
    });
  }

  /**
   *
   * @param payload
   */
  private updateProfileRes(payload) {
    localStorage.setItem('USER_PROFILE', JSON.stringify(payload));
    this.f.firstName.setValue(payload.firstName);
    this.f.lastName.setValue(payload.lastName);
    this.f.email.setValue(payload.email);
    this.f.phoneNumber.setValue(payload.phoneNumber);
    this.imageData = payload.profilePhoto;
    this.f.gender = payload.gender;
    console.log(this.imageData);
    console.log(payload);
  }

  public changePassword(){
    console.log(this.changepassword);
    this.state.loader = true;
    this._authService.changePassword(this.changepassword).subscribe(
      (res) => {
        this.state.loader = false;
        console.log(res);
        this._router.navigateByUrl('/home');
        // return this.state.showSuccess = true;
        this._notificationService.showSuccess(CUSTOM_CONSTANTS.PASSWORD_CHANGE_SUCCESS);
      },
      err => {
        this.state.loader = false;
        this._notificationService.showError('Error occurred!', err, err.status !== 422 ? CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE : err.error.message);
      }
    );
  }

}
