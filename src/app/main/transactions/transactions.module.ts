import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/modules/shared.module';
import {JwSocialButtonsModule} from "jw-angular-social-buttons";

const routes: Routes = [
  {path: '', component: IndexComponent}
];

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    JwSocialButtonsModule
  ]
})
export class TransactionsModule { }
