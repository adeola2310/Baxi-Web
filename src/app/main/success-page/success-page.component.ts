import {Component, OnDestroy, OnInit} from '@angular/core';
import {triggerModalOrOverlay} from '../../shared/utilities/helper';
import {Store} from '@ngrx/store';
import {PaymentState} from '../../store/states/app.state';
import {NotificationService} from '../../shared/services/notification.service';
import {Router} from '@angular/router';
import {Session} from '../../shared/utilities/session';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss']
})
export class SuccessPageComponent implements OnInit, OnDestroy {

  public payload: any = {};
  public transCompleteFull: any = {};

  // public payloads = {
  //   categories: [],
  //   billers: []
  // };
  constructor(private _store: Store<PaymentState>, private _notificationService: NotificationService, private _router: Router) { }

  ngOnInit() {
    // if (!Session.get('PAYMENT_DONE')) {
    //   this._notificationService.showError('the page you requested is not allowed', null, 'Not Allowed!');
    //   this._router.navigate(['/']);
    // } else {
    //   this.payload = Session.get('PAYMENT_DONE');
    //   this.transCompleteFull = Session.get('COMPLETE_FULL');
    //   console.log('COMPLETE_FULL');
    //   console.log(this.transCompleteFull);
    //   console.log('PAYMENT_DONE');
    //   console.log(this.payload);
    //   console.log(Session.get('PAYMENT_DONE'));
    //
    // }
    if (Session.get('PAYMENT_DONE')) {
        this.payload = Session.get('PAYMENT_DONE');
        this.transCompleteFull = Session.get('COMPLETE_FULL');
        console.log('COMPLETE_FULL');
        console.log(this.transCompleteFull);
        console.log('PAYMENT_DONE');
        console.log(this.payload);
        console.log(Session.get('PAYMENT_DONE'));
    } else if (!Session.get('PAYMENT_DONE')){
        this._notificationService.showError('the page you requested is not allowed', null, 'Not Allowed!');
        this._router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    Session.remove('PAYMENT_DONE');
    Session.remove('COMPLETE_FULL');
  }

}
