import {Injectable} from '@angular/core';
import {IndividualConfig, ToastrService} from 'ngx-toastr';
import {errorHelper} from '../utilities/helper';


declare const swal: any;

// sweetAlertNotification
export const DASHBOARD_ALERT = (alert_title?, alert_text?, alert_type?, confBtn = 'Yes', cancelBtn?) => {
  return swal({
    title: alert_title,
    text: alert_text,
    type: alert_type,
    showCancelButton: !!cancelBtn,
    confirmButtonClass: 'btn btn-success',
    confirmButtonText: confBtn,
    cancelButtonClass: cancelBtn ? 'btn btn-danger' : ''
  });
};

/**
 * NotificationPosition
 */
export enum NotificationPosition {
  TOP_RIGHT = 'toast-top-right',
  TOP_LEFT = 'toast-top-left',
  BOTTOM_RIGHT = 'toast-bottom-right',
  BOTTON_LEFT = 'toast-bottom-left',
  TOP_CENTER = 'toast-top-center'
  // Other positions I would like
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly DEFAULT_DELAY = 7000;

  constructor(private toastr: ToastrService) {
  }

  /**
   *
   * @param {string} message
   * @param title
   * @param {boolean}
   * @returns {any}
   */
  public showSuccess(message: string, title?: any, progressBar?: boolean, timeOut = this.DEFAULT_DELAY, positionClass = NotificationPosition.TOP_CENTER): any {
    // const delay = this.manageTimeDelay(timeOut);
    return this.toastr.success(message, title, {timeOut, progressBar, positionClass});
  }

  /**
   *
   * @param {string} message
   * @param error
   * @param title
   * @param {number} timeOut
   * @param {NotificationPosition} positionClass
   * @return {any}
   */
  public showError(message: string, error?,  title?: any, timeOut = this.DEFAULT_DELAY, positionClass = NotificationPosition.TOP_CENTER): any {
    // const delay = this.manageTimeDelay(timeOut);
    const response = errorHelper(message, error);
    return this.toastr.error(response, title, {timeOut: timeOut === null ? this.DEFAULT_DELAY : timeOut, positionClass});
  }

  /**
   *
   * @param message
   * @param title
   * @param
   */
  public showWarning(message: string, title?: any, timeOut = this.DEFAULT_DELAY): any {
    // const delay = this.manageTimeDelay(timeOut);
    return this.toastr.warning(message, title, {timeOut});
  }

  /**
   *
   * @param message
   * @param title
   * @param
   */
  public showInfo(message: string, title?: any, timeOut = this.DEFAULT_DELAY): any {
    // const delay = this.manageTimeDelay(timeOut);
    return this.toastr.info(message, title, {timeOut});
  }


  individualConfig: Partial<IndividualConfig> = {
    // positionClass: 'toast-top-right',
    progressBar: false,
    closeButton: true,
    onActivateTick: true,
    enableHtml: false,
  };
}
