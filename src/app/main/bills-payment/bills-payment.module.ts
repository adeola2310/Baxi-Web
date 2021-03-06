import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/modules/shared.module';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'search/:data', component: IndexComponent},
  {path: ':notFound', component: IndexComponent}
];

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BillsPaymentModule { }
