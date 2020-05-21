import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from './shared/modules/shared.module';
import { StoreModule } from '@ngrx/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpInterceptorService} from './shared/services/http-interceptor.service';
import {ToastrModule} from 'ngx-toastr';
import {reducers} from './store/reducers';
import { StorageModule } from '@ngx-pwa/local-storage';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ToastrModule.forRoot({closeButton: true, preventDuplicates: true, enableHtml: true}),
    StoreModule.forRoot(reducers),
    StorageModule.forRoot({IDBNoWrap: true})
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
  ],
  exports: [
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
