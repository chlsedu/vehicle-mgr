import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {en_US,  NZ_I18N} from 'ng-zorro-antd';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {AppRoutingModule} from './app-routing.module';
import {CookieService} from "ngx-cookie-service";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
