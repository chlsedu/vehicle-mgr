/* "Barrel" of Http Interceptors */
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from "./auth-interceptor";
import {Router} from "@angular/router";

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useFactory: function (router: Router) {
      return new AuthInterceptor(router);
    },
    multi: true,
    deps: [Router]
  },
];
