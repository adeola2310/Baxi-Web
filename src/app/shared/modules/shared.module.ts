import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginModalComponent} from '../components/login-modal/login-modal.component';
import {SignupModalComponent} from '../components/signup-modal/signup-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BillerSearchResultsComponent} from '../components/biller-search-results/biller-search-results.component';
import {HttpClientModule} from '@angular/common/http';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
import {RavepaymentComponent} from '../components/ravepayment/ravepayment.component';
import {PaymentComponent} from '../components/payment/payment.component';
import {MatchValueDirective, NoWhitespaceDirective} from '../directives/common-form-directive';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    LoginModalComponent,
    SignupModalComponent,
    BillerSearchResultsComponent,
    RavepaymentComponent,
    PaymentComponent,
    MatchValueDirective,
    NoWhitespaceDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    HttpClientModule,
    TooltipModule.forRoot()
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    LoginModalComponent,
    SignupModalComponent,
    BillerSearchResultsComponent,
    RavepaymentComponent,
    PaymentComponent
  ]
})
export class SharedModule { }
