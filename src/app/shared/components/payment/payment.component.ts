import {Component, NgZone, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {PaymentState} from '../../../store/states/app.state';
import {CUSTOM_CONSTANTS} from '../../utilities/config';
import {TransactionService} from '../../services/transaction/transaction.service';
import * as PaymentActions from '../../../store/actions/payment.actions';
import {Router} from '@angular/router';
import { RequestService } from '../../services/request/request.service';
import {PaymentVerificationHelper} from '../../classes/payment-verification-helper';
import {Session} from '../../utilities/session';

declare const $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent extends PaymentVerificationHelper implements OnInit {

  public paymentObj: any = {};
  public payload: any = {};

  constructor(private _store: Store<PaymentState>, private _transactionService: TransactionService,
              private _router: Router, private _ngZone: NgZone, private _requestService: RequestService) {
    super(_requestService);
  }

  ngOnInit() {
    this._store.select('payment').subscribe(res => {
      console.log(res);
      if (res.action === 'TRIGGER_PAYMENT') {
       this._ngZone.runOutsideAngular( () => {
         this.paymentObj = res.paymentObject;
         this.paymentObj.key = CUSTOM_CONSTANTS.RAVE_PUBLIC_KEY;
         setTimeout(() => $('#raveBtn').trigger('click'), 10);
       });
      }
    });
  }

  /**
   * This calls FLUTTER_WAVE RAVE API
   * @param data
   */
  public triggerPayment(data) {
    setTimeout(() => $('#raveBtn').trigger('click'), 10);
  }

  /**
   *
   * @param event
   */
  public paymentDone(event): void {
    //Call Payment Trnx update and get actual payment status
    this._transactionService.completeTransaction({trnxRef: event.tx.txRef, productRef: event.tx.txRef, valueEndpoint: this.payload.valueEndpoint, valueRequest: JSON.stringify(this.payload.valueRequest)}).subscribe(
      res => {
        // let call the request bus to re route the service based of the payment provider action
        console.log(res);
        const requestData = {payload: this.paymentObj, data: res.data};
        console.log(res.data);
        // If Payment Status is PAID-SUCCESSFULLY
        if (res.status){
          console.log('STATUS');
          console.log(res.status);

          // Call B2B to get value
          this.requestBus(requestData).subscribe(
            response => {
              console.log(response);
              // here let dispatch the payment done action and send the payment data to the success page

              // Call PUT /complete endpoint and post transaction id
              /**
               * {
               *   trnxRef: "value"
               *   productRef: ""
               * }
               *
               */
              let pinItems = '';
              let tokenCode = '';
              if (res.data.biller.billerCategory.toLowerCase() === 'epin') {

                for ( let i = 0; i < response.data.pins.length; i++) {
                  if (pinItems) {
                    pinItems = pinItems + ' ' + response.data.pins[i].pin;
                  } else {
                    pinItems = response.data.pins[i].pin;
                  }
                }
              }
              if (response.data.tokenCode === undefined) {
                response.data.tokenCode = '';
              }

              if (response.data.transactionInstruction === undefined) {
                response.data.transactionInstruction = '';
              }
              this._transactionService.completeFullTransaction({ trnxRef: event.tx.txRef, productRef : response.data.baxiReference,
                receiptCustomerName: res.data.receiptCustomerName, valueEndpoint: this.payload.valueEndpoint, valueRequest: JSON.stringify(this.payload.valueRequest),
                transactionInstruction: response.data.transactionInstruction,
                transactionValue: response.data.tokenCode, transactionValueDetail: pinItems}).subscribe(
                res => {
                  console.log("FULL-RESPONSE");
                  console.log(res);
                  Session.set('COMPLETE_FULL', res.data);
                  // tslint:disable-next-line:no-shadowed-variable
                  // const requestData = {payload: this.paymentObj, data: res.data};
                  // console.log(requestData);
                  //
                  this._ngZone.run(() => {
                    Session.set('PAYMENT_DONE', response.data);
                    window.location.href = 'transaction-successful';
                  });
                }
              );
            }, err => {
              console.log(err);
            }, () => {
            }
          );

          // If Payment Status is INCOMPLETED
        } else {
          console.log('transaction code invalid');
        }
      }, err => {
        console.error(err);
      }
    );
  }


  public cancelPayment(): void {
    console.log('PAYMENT_CLOSED');
    this.paymentObj = {};
  }
}
