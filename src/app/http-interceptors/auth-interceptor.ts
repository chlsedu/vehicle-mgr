import {throwError} from 'rxjs';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // send cloned request with header to the next handler.
    return next.handle(req).pipe(catchError((error: any) => {
      if (error.status === 400) {

      }
      if (error.status === 401 || error.status === 403) {
        //navigate /delete cookies or whatever
        this.router.navigateByUrl(`/login`);
        // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      }
      return throwError(error);
    }));
  }
}
