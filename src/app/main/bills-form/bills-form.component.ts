import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillersService} from '../../shared/services/billers-service/billers.service';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {isNumberKey, minMaxValue, specify, trimStringToCase, validateAllFormFields} from '../../shared/utilities/helper';
import {Session} from '../../shared/utilities/session';
import {ProviderService} from '../../shared/services/provider/provider.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import validate = WebAssembly.validate;
import {NotificationService} from '../../shared/services/notification.service';
import {CUSTOM_CONSTANTS} from '../../shared/utilities/config';
import * as AuthActions from '../../store/actions/auth.actions';
import {TokenService} from '../../shared/services/token.service';
import {TransactionService} from '../../shared/services/transaction/transaction.service';
import * as PaymentActions from '../../store/actions/payment.actions';
import {removeSpaces} from '../../shared/directives/common-form-directive';
import {environment as env} from '../../../environments/environment';


@Component({
  selector: 'app-bills-form',
  templateUrl: './bills-form.component.html',
  styleUrls: ['./bills-form.component.scss']
})
export class BillsFormComponent implements OnInit, OnDestroy {

  public state = {
    loader: {
      fetch: true,
      post: false
    },
    isContinue: false,
    amountIsEdit: false
  };

  public payload: any = {
    billerDetails: {},
    billerProvider: {
      title: '',
      plans: [],
      verifiedName: '', // verified name after the name check return success
      availablePin: '',
      multichoice: {
        list: [],
        addons: []
      }
    }
  };

  public billerForm: any = {
    data: {}
  };

  public billerServiceForm: FormGroup;

  static billerFormControl = () => {
    return {
      accountNumber: [''],
      phoneNumber: [''],
      amount: [''],
      numberOfPin: [''],
      pinValue: [''],
      cardNumber: [''],
      plan: [''],
      list: ['']
    };
  }

  constructor(private _store: Store<'notFound | PaymentState | AuthState'>,
              private _token: TokenService,
              private _billerService: BillersService,
              private _route: ActivatedRoute,
              private _router: Router,
              private _providerService: ProviderService,
              private _fb: FormBuilder,
              private  _notificationService: NotificationService,
              private _transactionService: TransactionService) {
    this.billerServiceForm =  _fb.group(BillsFormComponent.billerFormControl());
  }

  ngOnInit() {
    const path = this._route.snapshot.params.biller;

    console.log('===bills-form.component.html====');
    console.log(path);
    console.log('===bills-form.component.html====');

    this._billerService.getAllBillerProviders().subscribe(
      res => {
        this.state.loader.fetch = false;
        const data =  res.data.find(item => {
          return trimStringToCase(path, 'LOWER') === trimStringToCase(item.biller_name, 'LOWER');
        });
        if (data === undefined) {
          this._router.navigate([`/bills-payment/${path}`]);
        }

        console.log(data);

        this.getBillerData(); // get Biller
      }, err => {
        console.log(err);
      }
    );
  }

  ngOnDestroy(): void {
    Session.remove('BILLER_DATA'); // CLEAR BILLER DATA ON DESTROY
  }

  private getBillerData(): void {
    this.payload.billerDetails = Session.get('BILLER_DATA');
    const BILLER_CATEGORY = this.payload.billerDetails.serviceCategory.toUpperCase();
    switch (BILLER_CATEGORY) {
      case 'CABLETV' :
        this.billerServiceForm.get('cardNumber').setValidators(Validators.compose([Validators.required, Validators.minLength(10), removeSpaces]));
        this.billerServiceForm.get('plan').setValidators(Validators.compose([Validators.required]));
        this.billerServiceForm.get('list').setValidators(Validators.compose([Validators.required]));
        this.cableTv('GET_PLANS'); // load cable tv
        break;

      case 'ELECTRICITY' :
        this.billerServiceForm.get('accountNumber').setValidators(Validators.compose([Validators.required, removeSpaces]));
        this.billerServiceForm.get('phoneNumber').setValidators(Validators.compose([Validators.required, removeSpaces]));
        this.billerServiceForm.get('amount').setValidators(Validators.compose([Validators.required, removeSpaces, minMaxValue(250, 'MIN')]));
        break;

      default :
        this.billerServiceForm.get('numberOfPin').setValidators(Validators.compose([Validators.required]));
        this.billerServiceForm.get('pinValue').setValidators(Validators.compose([Validators.required]));
        this.billerServiceForm.get('plan').setValidators(Validators.compose([Validators.required]));
        this.ePins('EPIN_OPTIONS');
        break;
    }
  }

  /**
   *
   * @param methodAction
   * @param formObject
   */
  private cableTv(methodAction: string, formObject?: any): void {
     if (this.payload.billerDetails.serviceBiller.toLowerCase() === 'multichoice' || this.payload.billerDetails.serviceBiller.toLowerCase() === 'startimes') {
       let payload;
       switch (methodAction) {
         case 'GET_PLANS' :
           const serviceBiller = this.payload.billerDetails.serviceBiller.toLowerCase();
           if (serviceBiller === 'multichoice') {
             // let call the addons API
             payload = {service_type: this.payload.billerDetails.serviceType};
             this._providerService.getProviderPlans(payload, 'MULTICHOICE').subscribe(
               res => {
                 this.payload.billerProvider.title = 'Select Plan Option';
                 res.data.forEach((e, i) => {
                   this.payload.billerProvider.plans = [
                     ...this.payload.billerProvider.plans, {id: i, name: `${e.code} - ${e.name}`, list: e.availablePricingOptions, code: e.code}
                   ];
                 });
               }, err => {
                 console.log(err);
               }
             );
           } else if (serviceBiller === 'startimes') {
             console.log('hello');
             payload = {service_type: this.payload.billerDetails.serviceType};
             this._providerService.getProviderPlans(payload, 'STARTIMES').subscribe(
               res => {
                 this.payload.billerProvider.title = 'Select Plan Option';
                 res.data.forEach((e, i) => {
                   this.payload.billerProvider.plans = [
                     ...this.payload.billerProvider.plans, {id: i, name: `${e.code} - ${e.name}`, list: e.availablePricingOptions, code: e.code}
                   ];
                 });
               }, err => {
                 console.log(err);
               }
             );
           } else {

           }
           break;
         case 'VERIFY_NAME' :
           // let get the addons when the continue button is clicked
           (() => {
              payload = {type: this.payload.billerDetails.serviceType, code: formObject.plan.code};
              this._providerService.getProviderRequest('MULTICHOICE', payload).subscribe(
                res => {
                  res.data.forEach((e) => {
                    this.payload.billerProvider.multichoice.addons = [
                      ...this.payload.billerProvider.multichoice.addons, {id: e.code, name: `${e.code} - ${e.name}`, list: e.availablePricingOptions}
                    ];
                  });
                }, err => {
                  console.error(err);
                }
              );
           })();
           // self invoke function to call the name enquiry API
           (() => {
             payload = {type: this.payload.billerDetails.serviceType, number: formObject.cardNumber};
             this.state.loader.post = true;
             this._providerService.getProviderRequest('NAME_FINDER', payload).subscribe(
               res => {
                 console.log(res);
                 this.state.loader.post = false;
                 this.state.isContinue = true;
                 this.payload.billerProvider.verifiedName = res.data.user.name.toUpperCase();
                 this.billerForm.data.amount = specify(formObject.list.id.toString());
               }, err => {
                 this.state.loader.post = false;
                 console.error(err);
                 this._notificationService.showError('Error Occurred', err, CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE);
               }
             );
           })();
           break;
         default :
           const paymentObject = {
             ref: formObject.trnxRef,
             amount: formObject.amount,
             cardNumber : this.billerServiceForm.value.cardNumber,
             productCode: this.billerForm.data.code,
             productDuration: this.billerForm.data.duration,
             addonCode: this.billerForm.data.code2,
             addonDuration: this.billerForm.data.duration2,
             email: formObject.customerDetails.email,
             title: `Payment for ${this.payload.billerDetails.serviceName}`,
             service_type: this.payload.billerDetails.serviceType,
             provider: this.payload.billerDetails.serviceCategory.toUpperCase()
           };
           this._store.dispatch(new PaymentActions.MakePayment({action: 'TRIGGER_PAYMENT', paymentObject}));
       }
     }
  }

  /**
   *
   * @param methodAction
   * @param payload
   */
  private electricity(methodAction: string, payload?: any): void {
    // this method is called only when it electricity
    if (methodAction === 'VERIFY_NUMBER') {
      const request = {service_type:  this.payload.billerDetails.serviceType, account_number: payload.accountNumber};
      this.state.loader.post = true;
      this._providerService.getProviderRequest('VERIFY_NAME', request).subscribe(
        res => {
          this.state.loader.post = false;
          console.log(payload);
          // after verifying make the payment form active
          // open payment form
          this.state.isContinue = true;
          this.payload.billerProvider.verifiedName = res.data.user.name;
          this.billerForm.data.amount = specify(payload.amount.toString());
          this.billerForm.data.accountNumber = payload.accountNumber;
          this.billerForm.data.phone = payload.phoneNumber;
        }, err => {
          this.state.loader.post = false;
          console.log(err);
          return this._notificationService.showError('Error Occurred', err, CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE);
        }
      );
    } else {
      const paymentObject = {
        ref: payload.trnxRef,
        amount: payload.amount, // this amount must be 250 above
        email: payload.customerDetails.email,
        title: `Electricity Bills Payment to ${this.payload.billerDetails.serviceName}`,
        account_number: this.billerForm.data.accountNumber,
        phone: this.billerForm.data.phone,
        service_type: this.payload.billerDetails.serviceType,
        provider: this.payload.billerDetails.serviceCategory.toUpperCase(),
      };
      console.log('===payload===');
      console.log(payload);
      console.log('===payload===');

      Session.set('PAYMENT_DONE', payload);

      console.log('====get payload===');
      console.log(Session.get('PAYMENT_DONE'));
      console.log('====get payload===');

      this._store.dispatch(new PaymentActions.MakePayment({action: 'TRIGGER_PAYMENT', paymentObject}));
    }

  }

  /**
   *
   * @param methodAction
   * @param formObject
   */
  private ePins(methodAction: string, formObject?: any): void {
    console.log(this.payload.billerDetails);
    switch (methodAction) {
      case 'EPIN_OPTIONS' :
        this._providerService.getProviderRequest('EPINS', {type: this.payload.billerDetails.serviceType}).subscribe(
          res => {
            console.log(res);
            res.data.forEach((e) => {
              this.payload.billerProvider.plans = [
                ...this.payload.billerProvider.plans, {id: e.amount, name: e.description + ' - N' + e.amount, available: e.available}
              ];
            });
            this.payload.billerProvider.title = 'Select pin bundles';
          }, err => {
            this._notificationService.showError('Error Occurred', err, CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE);
          }
        );
        break;
      case 'EPIN_DATA' :
        // let do small validation by checking if the number of pins entered is > than selected available pin
        console.log(formObject);
        // tslint:disable-next-line:radix
        if (parseInt(formObject.numberOfPin) > this.billerForm.data.available) {
          return this._notificationService.showError( this.payload.billerProvider.availablePin );
        }
        const epinData = {
          amount: specify(formObject.pinValue.toString()),
          pinNumber: formObject.numberOfPin,
          pinValue: formObject.pinValue
        };
        this.billerForm.data = epinData;
        this.state.isContinue = true;
        break;
      default :
        const paymentObject = {
          ref: formObject.trnxRef,
          amount: this.billerForm.data.pinValue,
          numberOfPin: this.billerForm.data.pinNumber,
          pinValue: this.billerForm.data.pinValue,
          email: formObject.customerDetails.email,
          title: `Payment for ${this.payload.billerDetails.serviceName}`,
          service_type: this.payload.billerDetails.serviceType,
          provider: this.payload.billerDetails.serviceCategory.toUpperCase()
        };
        this._store.dispatch(new PaymentActions.MakePayment({action: 'TRIGGER_PAYMENT', paymentObject}));
        break;
    }
  }

  /**
   *
   * @param event
   */
  public isNumKey(event) {
    return isNumberKey(event);
  }

  /**
   *
   * @param event
   * @param elementId
   */
  public formatter(event, elementId?) {
    return specify(event.target.value, elementId);
  }

  /**
   *
   * @param event
   * @param type
   */
  public changeProviderOption(event, type?): void {
    if (this.payload.billerDetails.serviceCategory === 'epin') {
      console.log(event);
      this.payload.billerProvider.availablePin = `Number of PINs requested cannot be more than (${event.available})`;
      this.billerForm.data = event; // store the select object temporarily in the data object
    } else if (this.payload.billerDetails.serviceCategory === 'cabletv') {
      if (this.payload.billerDetails.serviceBiller === 'Multichoice' || this.payload.billerDetails.serviceBiller === 'Startimes') {
        // check if the select option as extra parameter TYPE
        if (type) {
          switch (type) {
            case 'ADDON_SELECT' :
              console.log(event);
              this.billerForm.data.list = [];
              event.list.forEach((e) => {
                this.billerForm.data.list = [
                  ...this.billerForm.data.list,
                  {id: e.price, name: `(NGN ${e.price}) for ${e.monthsPaidFor} ${e.monthsPaidFor > 1 ? 'months' : 'month' }`, duration: e.monthsPaidFor, code: event.id}
                ];
              });
              break;
            case  'ADDON_ADD' :
              console.log(event);
              // let add addon price e to the bouquet price and others
              // tslint:disable-next-line:radix
              const price = parseInt(this.billerServiceForm.value.list.id) + parseInt(event.id);
              this.billerForm.data.amount = specify(price.toString());
              this.billerForm.data.code2 = event.code;
              this.billerForm.data.duration2 = event.duration;
              break;
            default :
              this.billerForm.data.duration = event.duration; // set duration fro selected plan option
              break;
          }
        } else {
          // this.payload.billerProvider = [];
          console.log(this.payload.billerProvider);
          this.billerForm.data = event;
          // let get thee duration and price available for selected plan
          this.payload.billerProvider.multichoice.list = []; // all ways set the list to empty before push new ones;
          this.billerServiceForm.get('list').setValue(''); // set the selected value to empty;
          this.payload.billerProvider.plans.find((a, i) => {
           if (i === event.id) {
             a.list.forEach((e) => {
               this.payload.billerProvider.multichoice.list = [
                 ...this.payload.billerProvider.multichoice.list,
                 {id: e.price, name: `(NGN ${e.price}) for ${e.monthsPaidFor} ${e.monthsPaidFor > 1 ? 'months' : 'month' }`, duration: e.monthsPaidFor}
               ];
             });
           }
         });
        }
      }
    }
  }

  public proceedContinue(): void {
    // let always check the form validations and show errors if necessary
    if (!this.billerServiceForm.valid) {
      return validateAllFormFields(this.billerServiceForm);
    }
    // calling electricity if service category is electricity
    if (this.payload.billerDetails.serviceCategory === 'electricity') {
     return this.electricity('VERIFY_NUMBER', this.billerServiceForm.value);
    }

    // calling ePins if service category is ePins
    if (this.payload.billerDetails.serviceCategory === 'epin') {
      return this.ePins('EPIN_DATA', this.billerServiceForm.value);
    }

    // calling cabletv if service category is cableTv
    if (this.payload.billerDetails.serviceCategory === 'cabletv') {
      return this.cableTv('VERIFY_NAME', this.billerServiceForm.value);
    }
  }

  /**
   *
   * @param action
   * @param evt
   */
  public extraDomFunctionality(action: string, evt?: any): void {
    switch (action) {
      case 'EDIT_AMOUNT' :
        this.state.amountIsEdit = true;
        break;
      case  'AFTER_EDIT_AMOUNT' :
        this.state.amountIsEdit = false;
        this.billerForm.data.amount = specify(evt.target.value);
        break;
    }
  }

  public pay(): void {

    if (!this._token.isTokenLogged()) {
      return this._store.dispatch(new AuthActions.OpenModal({action: 'SHOW', type: 'LOGIN'}));
    }

    const payload = {
      paymentMethodId: 2,
      billerName: this.payload.billerDetails.serviceType,
      amount: this.billerForm.data.amount,
      transactionValue: this.payload.token,
      recipientAccount: this.billerForm.data.accountNumber,
      valueEndpoint: '',
      valueRequest: ''
    };
    console.log('RECIPIENT ACCOUNT');

    console.log(this.billerForm.data);
    if (this.payload.billerDetails.serviceCategory === 'epin') {
      payload.billerName += '_pin_vending';
      payload.valueEndpoint = `${env.BASE_URL2}`;
      payload.valueRequest = `${env.BASE_URL2}services/epin/request`;
    }
    if (this.payload.billerDetails.serviceCategory === 'electricity') {
      payload.valueRequest = `${env.BASE_URL2}services/electricity/request`;
      payload.valueEndpoint = `${env.BASE_URL2}`;
    }
    if (this.payload.billerDetails.serviceCategory === 'cabletv') {
      payload.recipientAccount = this.billerServiceForm.value.cardNumber;
      payload.valueRequest = `${env.BASE_URL2}services/multichoice/request`;
      payload.valueEndpoint = `${env.BASE_URL2}`;

    }
    console.log('CARD NUMBER');
    console.log(payload.recipientAccount);
    this.state.loader.post = true;
    this._transactionService.LogTransactions(payload).subscribe(res => {
      this.state.loader.post = false;
      switch (this.payload.billerDetails.serviceCategory) {
        case 'electricity':
          return this.electricity('MAKE_PAYMENT', res.data);
        case 'epin' :
          return this.ePins('MAKE_PAYMENT', res.data);
        case 'cabletv' :
          return this.cableTv('MAKE_PAYMENT', res.data);
      }
    }, err => {
      this.state.loader.post = false;
      this._notificationService.showError('Error', err, CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE);
      if (err.status === 401) {
        this._store.dispatch(new AuthActions.OpenModal({action: 'SHOW', type: 'LOGIN'}));
      }
    });
  }
}
