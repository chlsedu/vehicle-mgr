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
import {RouteReuseStrategy} from "@angular/router";
import {ReuseTabStrategy} from "./reuse-tab/reuse-tab.strategy";
import { ZmMovableModalDirective } from './directive/zm-movable-modal.directive';
// import { ReuseTabComponent } from './reuse-tab/reuse-tab.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    ZmMovableModalDirective,
    // ReuseTabComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzNotificationModule,
    AppRoutingModule/*Notice that the AppRoutingModule is last*/
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    CookieService,
    httpInterceptorProviders,
    {provide: RouteReuseStrategy, useClass: ReuseTabStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
