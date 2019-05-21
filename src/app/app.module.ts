import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {en_US, NZ_I18N, NzNotificationModule} from 'ng-zorro-antd'; /*the UtilitiesService providedIn: 'root',so deps module needed declared in here*/
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {AppRoutingModule} from './app-routing.module';
import {CookieService} from "ngx-cookie-service";
import {httpInterceptorProviders} from "./http-interceptors";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzNotificationModule,
    AppRoutingModule
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}, CookieService,
    httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
