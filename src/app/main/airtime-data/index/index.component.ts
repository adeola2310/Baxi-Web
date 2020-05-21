import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  elementShowHide,
  isArrayObjectSelected,
  isNumberKey,
  scrollToDiv,
  specify,
  triggerModalOrOverlay
} from '../../../shared/utilities/helper';
import {ProviderService} from '../../../shared/services/provider/provider.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {NgForm, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AuthState, PaymentState} from '../../../store/states/app.state';
import * as PaymentActions from '../../../store/actions/payment.actions';
import {CUSTOM_CONSTANTS} from '../../../shared/utilities/config';
import {TransactionService} from '../../../shared/services/transaction/transaction.service';
import {TokenService} from '../../../shared/services/token.service';
import * as AuthActions from '../../../store/actions/auth.actions';
import { RequestService } from 'src/app/shared/services/request/request.service';
import { telco, telcos } from 'src/app/shared/utilities/telco';
import { Subject } from 'rxjs';
import { TelcoModel } from 'src/app/shared/utilities/TelcoModel';
import { BroadcastNotificationService } from 'src/app/shared/services/app-service/broadcast-notification-service';
import { Provider } from 'src/app/shared/model/Provider';
import {environment as env} from '../../../../environments/environment';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {


  airtimeForm: FormGroup;
  submitted = false;

  /**
   *
   * @type {{provider: string; phoneNumber: string; amount: string}}
   */

  public purchaseFormControls: any = {
    provider: {},
    phoneNumber: '',
    amount: ''
  };

  public payloads = {
    provider: [],
    plan: []
  };

  /*Button click validation handler */
  public iscontinue = false;
  public Telconame;

  public requestpayload = {
    data: []
  }

  public telcosname = {
    name: []
  }

  public state = {
    isContinue: false,
    providerType: 'AIRTIME',
    loader: {
      fetch: false,
      post: false
    },
    amountIsEdit: false,
    paymentDone: false
  };

  public SelectedProvider : Provider;

  constructor(private _serviceProvider: ProviderService,
              private _notificationService: NotificationService,
              private _store: Store<PaymentState | AuthState>,
              private _transactionService: TransactionService,
              private _requestService: RequestService,
              private _broadcastNotificationService : BroadcastNotificationService,
              private  _token: TokenService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this._broadcastNotificationService.dataChanged$.subscribe( data => {
       if(localStorage.getItem("PaymentPending") == "true") {
          localStorage.removeItem("PaymentPending");
          this.pay();
       }
    });

    this.airtimeForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.minLength(10), Validators.required, Validators.pattern('[0-9]*$')]],
      // Amount: ['', [Validators.pattern('^\\d{1,3}(?:[,]\\d{3})*$'), Validators.min(50), Validators.required]]
      Amount: ['', [Validators.min(50), Validators.required]]
    })
    /****** make sure the right section is hide on mobile view*****************/
    if (window.innerWidth <= 768 ) {
      elementShowHide('.right-section', 'HIDE');
    }
    /***** get airtime*******************/
    this.getProviders('AIRTIME');
  }

  ngOnDestroy(): void {
    /******** we clear selected provider from the localstorage on close of the page ***********/
    localStorage.removeItem('selectedCat');
    localStorage.removeItem("PaymentPending");
  }

  // convenience getter for easy access to form fields
  get f() { return this.airtimeForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.airtimeForm.invalid) {
      return this._notificationService.showWarning('error somthing happend');
    }
    this.isContinue();

    // display form values on success
  }


  CommaFormatted(event) {
    // skip for arrow keys
    if (event.which >= 37 && event.which <= 40) return;

    // format number
    if (this.f.Amount) {
      this.f.Amount.setValue( this.f.Amount.value.replace(/\D/g, '')
       .replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }}

  numberCheck(args) {
   if (args.key === 'e' || args.key === '+' || args.key === '-') {
     return false;
   } else {
     return true;
   }
  }

  /**
   *
   * @param {string} type
   */
  public changeProviderType(type: string): void {
    this.payloads.provider = [];
    this.purchaseFormControls.provider = {};
    switch (type) {
      case 'BUY_AIRTIME' :
        this.state.providerType = 'AIRTIME';
        this.getProviders('AIRTIME');
        this.clearALlFields();
        break;

      default :
        this.state.providerType = 'DATA';
        this.getProviders('DATA');
        this.clearALlFields();
        break;
    }
  }

  /**
   *
   * @param {string} provider
   */
  private getProviders(provider: string): void {
    // some loader
    this.state.loader.fetch = true;
    this._serviceProvider.getAllProviders(provider).subscribe(
      res => {
        this.state.loader.fetch = false; // stop loading
        this.payloads.provider = res.data.providers;
        /***************** get selected provider from the home page *************/
        const selectedCat = localStorage.getItem('selectedCat');

        if (selectedCat) {
          const payload = res.data.providers.find(e => e.service_type === selectedCat);
          const payloadIndex = res.data.providers.findIndex(e => e === payload);
          if (payload) {
            this.selectProvider(selectedCat, payload, payloadIndex);
          }

        }
      }, err => {
        this.state.loader.fetch = false; // stop loading
        console.error(err);
        this._notificationService.showError('Error', err, CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE);
      }
    );
  }

  /**
   * @description call this method when data provider is selected
   * @param type
   */
  private getAllProviderPlans(type): void {
    this.payloads.plan = [];
    this._serviceProvider.getProviderPlans(type).subscribe(res => {
      res.data.forEach((e) => {
          this.payloads.plan = [...this.payloads.plan, {id: e.price, name: e.name, code: e.datacode}];
      });
    }, err => {
      this._notificationService.showError('Error', err, CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE);
    });
  }

  /**
   *
   * @param {string} provider
   * @return {string}
   */
  public getProviderLogo(provider: string): string {
   switch (provider) {
     case 'mtn' :
       return 'assets/images/providers/mtn.png';
     case 'airtel' :
       return 'assets/images/providers/airtel.png';
     case 'glo' :
       return 'assets/images/providers/glo.png';
     case '9mobile' :
       return 'assets/images/providers/9mobile.png';
     case 'smile' :
       return 'assets/images/providers/smile.png';
     default :
       return 'assets/images/providers/ph.png';
   }
  }

  /**
   *
   * @param {string} type
   * @param {object} payload
   * @param {number} index
   */
  public selectProvider(type: string, payload: Provider, index: number): void {
    const element = document.querySelector('#pills-tabContent');
    this.iscontinue = true;
    if (element) {element.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    const providerArray = this.payloads.provider;
    // let loop the selected provider array or if selected
    isArrayObjectSelected(providerArray, 'selected');

    // add the selected property to the indexed card
    providerArray[index].selected = true;
    this.purchaseFormControls.provider = payload; // take in service type
    // this.purchaseFormControls.phoneNumber = '';
    this.SelectedProvider = payload;

    // now lot call the plan API If data provider is selected
    if (type === 'AIRTIME') {
      return;
    } else {
      this.getAllProviderPlans(payload['service_type']);
    }
  }

  /**
   *
   * @param {Event} event
   */
  public airtimeAmount(event: Event): void {
    return isNumberKey(event);
  }

  /**
   *
   * @param event
   * @return {string}
   */
  public formatter(event) {
    return this.purchaseFormControls.amount = specify(event.target.value);
  }



  /**
   *
   * @param event
   */
  public changeProviderPlan(event): void {
    this.purchaseFormControls.provider = Object.assign(this.purchaseFormControls.provider, {plan: event.name, dataCode: event.code});
    this.purchaseFormControls.amount = specify(event.id.toString()) + '.00';
  }

  /**
   * @description continue after click on the first form by the left
   */
  public isContinue(): void {
    if (this.purchaseFormControls.provider === {} && this.purchaseFormControls.amount === '0.00') {
      return this._notificationService.showInfo('Please select network provider', 'Info');
    }
    this.state.isContinue = true;

    // scroll to view on continue click on mobile
    if (window.innerWidth <= 768) {
      elementShowHide('.right-section', 'SHOW');
      scrollToDiv('airtime-pay-section', 500); // scroll to div when device is mobile
    }

  }

  public cancelTransaction(): void {
    this.state.isContinue = false;
    if (window.innerWidth <= 768) {
      elementShowHide('.right-section', 'HIDE');
      scrollToDiv('provider-section', 500); // scroll to div when device is mobile
    }
  }

  public removeOverlay(): void {
    this.state.isContinue = false;
    if (window.innerWidth <= 768) {
      elementShowHide('.right-section', 'HIDE');
      scrollToDiv('provider-section', 500); // scroll to div when device is mobile
    }
  }

  /**
   *
   * @param {string} action
   * @param evt
   */
  public extraDomFunationality(action: string, evt?): void {
    switch (action) {
      case 'EDIT_AMOUNT' :
        this.state.amountIsEdit = true;
        (document.getElementById('amountEdit') as HTMLInputElement).value = this.purchaseFormControls.amount.replace(/,/g, '').split('.').shift();
        break;
      case  'AFTER_EDIT_AMOUNT' :
        this.state.amountIsEdit = false;
        this.purchaseFormControls.amount = specify(evt.target.value);
        break;
    }
  }


  public pay(): void {

    if (!this._token.isTokenLogged()) {
      localStorage.setItem("PaymentPending", "true");
      return this._store.dispatch(new AuthActions.OpenModal({action: 'SHOW', type: 'LOGIN'}));
    }

    const payload = {
      paymentMethodId: 2,
      billerName: this.SelectedProvider.service_type,
      amount: this.f.Amount.value,
      recipientAccount: this.f.phoneNumber.value,
      valueEndpoint: '',
      valueRequest: ''
    };

    if (this.state.providerType === 'DATA') {
      payload.billerName += '_bundle';
      payload.valueEndpoint = `${env.BASE_URL2}`;
      payload.valueRequest = `${env.BASE_URL2}services/databundle/request`;

    }

    if(this.state.providerType === 'AIRTIME') {
      payload.valueEndpoint = `${env.BASE_URL2}`;
      payload.valueRequest = `${env.BASE_URL2}services/airtime/request`;
    }
    console.log("PAYLOAD IS HERE");
    console.log(payload);


    this.state.loader.post = true;
    this._transactionService.LogTransactions(payload).subscribe(res => {
      // console.log(this.state.providerType)
      this.state.loader.post = false;
      this.requestpayload = res.data;
      if (this.state.providerType === 'AIRTIME') {
        this.makeAirtimePayment(res.data);
      } else if (this.state.providerType === 'DATA') {
        this.makeDataPayment(res.data);
      }
    },
        err => {
      this.state.loader.post = false;
      console.log("=====Error Here=====");
      console.log(err);
      this._notificationService.showError('Error', err, CUSTOM_CONSTANTS.DEFAULT_ERROR_MESSAGE);
    });
  }

  /**
   *
   * @param payload
   */
  public makeAirtimePayment(payload: any): void {
    const paymentObject = {
      ref: payload.trnxRef,
      amount: payload.amount,
      email: payload.customerDetails.email,
      title: `Airtime Recharge for ${this.f.phoneNumber.value}`,
      phone: this.f.phoneNumber.value,
      provider: this.state.providerType,
      serviceType: this.purchaseFormControls.provider.service_type
    };
    this._store.dispatch(new PaymentActions.MakePayment({action: 'TRIGGER_PAYMENT', paymentObject}));
  }

  /**
   *
   * @param payload
   */
  public makeDataPayment(payload: any): void {
    const paymentObject = {
      ref: payload.trnxRef,
      amount: payload.amount,
      email: payload.customerDetails.email,
      title: `Data Recharge for ${this.f.phoneNumber.value}`,
      phone: this.f.phoneNumber.value,
      code: this.purchaseFormControls.provider.dataCode,
      provider: this.state.providerType,
      serviceType: this.purchaseFormControls.provider.service_type
    };
    console.log('SERVICE TYPE');
    console.log(this.purchaseFormControls.provider.service_type);
    // if (this.state.providerType === 'DATA') {
    //   paymentObject.serviceType += '_bundle';
    // }
    this._store.dispatch(new PaymentActions.MakePayment({action: 'TRIGGER_PAYMENT', paymentObject}));
  }

  // scrollToElement($element): void {
  //   $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  // }



  public telcos : Array<TelcoModel> = [
    {
        "name" : "MTN",
        "values" : ["0703","0706","0803","0806","0810","0813","0814","0816","0903","0906"],
    },
    {
        "name" : "GLO",
        "values" : ["0705","0805","0807","0811","0815","0905"],
    },
    {
        "name" : "airtel",
        "values" : ["0701","0708","0802","0808","0812","0902","0907","0901"],
    },
    {
        "name" : "9Mobile",
        "values" : ["0809","0817","0818","0908","0909"],
    },
    {
        "name" : "smile",
        "values" : ["0702"]
    },
]

public getTelcos(data:string){

  telcos.forEach((telco : TelcoModel) => {
    telco.values.forEach(( value : string) => {
      if(value===data){
        localStorage.setItem('selectedCat', telco.name.toLowerCase());
      }

    });
});

}

public selectTelcos($event){
  if(this.f.phoneNumber.value.length===4){
    this.getProviders("AIRTIME")
    this.getTelcos(this.f.phoneNumber.value)
    }
  }

  public clearALlFields(){
    this.purchaseFormControls.phone=''
    this.purchaseFormControls.phoneNumber=''
    this.purchaseFormControls.amountEdit=''
    this.purchaseFormControls.amount=''
  }
}

