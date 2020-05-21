import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/modules/shared.module';
import {IndexComponent} from './index/index.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', component: IndexComponent}
];

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BillerModule { }
