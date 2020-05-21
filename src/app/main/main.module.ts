import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {HeaderComponent} from './layouts/header/header.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from '../shared/utilities/auth.gaurd';
import { BillsFormComponent } from './bills-form/bills-form.component';
import { SuccessPageComponent } from './success-page/success-page.component';
import {SharedModule} from '../shared/modules/shared.module';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { SliderModule } from 'angular-image-slider';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: '', redirectTo: 'home',  pathMatch: 'full'},
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'transaction-successful', component: SuccessPageComponent},
      {
        path: 'airtime-data',
        loadChildren: () => import('./airtime-data/airtime-data.module').then(mod => mod.AirtimeDataModule)
      },
      { path: 'send-money', loadChildren: () => import('./send-money/send-money.module').then(mod => mod.SendMoneyModule) },
      { path: 'tv-subscription', loadChildren: () => import('./tv-subscription/tv-subscription.module').then(mod => mod.TvSubscriptionModule) },
      { path: 'electricity-bills', loadChildren: () => import('./electricity-bills/electricity-bills.module').then(mod => mod.ElectricityBillsModule) },
      { path: 'bills-payment', loadChildren: () => import('./bills-payment/bills-payment.module').then(mod => mod.BillsPaymentModule) },
      { path: 'billers', loadChildren: () => import('./billers/biller.module').then(mod => mod.BillerModule) },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(mod => mod.TransactionsModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(mod => mod.ProfileModule),
        canLoad: [AuthGuard]
      },
      { path: ':biller', component: BillsFormComponent},
      { path: '404', redirectTo: 'bills-payment/not-found'},
      { path: '**', redirectTo: '/404' }
    ]
  },
];

@NgModule({
  declarations: [
    HeaderComponent,
    MainComponent,
    HomeComponent,
    BillsFormComponent,
    SuccessPageComponent,
    // IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SliderModule,
    RouterModule.forChild(routes),
    Ng2SearchPipeModule,
    JwSocialButtonsModule
  ]
})
export class MainModule { }
