import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { IndexComponent } from './index/index.component';


const routes: Routes = [
  {path: '', component: IndexComponent}
];

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ElectricityBillsModule { }
