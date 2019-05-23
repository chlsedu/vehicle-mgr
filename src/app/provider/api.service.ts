import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {UtilitiesService} from "./utilities.service";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected configUrl = 'assets/config.json';
  public config: any;
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  protected httpOptionsJwt;
  protected jwtToken: string;
  protected httpOptionsOauth;
  protected access_token: string;

  constructor(protected http: HttpClient, protected router: Router, protected cookieService: CookieService) {
    (async () => {
      let configPromise = await this.fetchConfig().toPromise()
      this.config = configPromise;
      /*{
        this.httpOptionsJwt = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.config["jwtParameter"].Authorization + this.jwtToken
          })
        };
        this.httpOptionsOauth = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.config["oauthParameter"].Authorization
          })
        };
      }*/
    })();
    /*while (true) {
      break;
    }*/
    // this.getConfig();
  }

  private toLogin(): void {
    this.router.navigateByUrl(this.config["user"].loginUrl)
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  protected assemUrl(url: string, isOauth: boolean): string {
    let _url: string = url;
    // if (isOauth) _url = url + '?access_token=' + this.access_token;
    return _url;
  }

  // 0 requests made - .subscribe() not called but toPromise.
  protected fetchConfig(): Observable<any> {
    return this.http.get<any>(this.configUrl)
    /*.pipe(
      catchError(this.handleError)
    );*/
  }

  //The all query is by post way,not get,put or delete!
  protected fetchData(data: any, url: string): Observable<any> {
    this.jwtToken = this.cookieService.get("jwtToken");
    this.httpOptionsJwt = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.config["jwtParameter"].Authorization + this.jwtToken
      })
    };
    return this.http.post<any>(this.assemUrl(url, false), data, this.httpOptionsJwt)
    /*.pipe(
      catchError(this.handleError)
    );*/
  }

  public subscribeData(url: string, data: any, cb): void {
    this.fetchData(data, url).subscribe((data: any) => {
      switch (data.code) {
        case 0:
          cb && cb(data);
          break;
        case 1:
          cb && cb(null, data);
          break;
        case 2:
          this.toLogin();
          break;
        default:
          break;
      }
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  constructor(protected apiService: ApiService, protected utilities: UtilitiesService,) {

  }

  public async getData(data: any, cb) {
    if (this.apiService.config == null) {
      let _t: any | undefined = await this.utilities.sleep(1000);
    }
    let url = this.apiService.config["company"].api.user;
    this.apiService.subscribeData(url, data, cb)
  }

  public async getDataById(data: any, cb) {
    if (this.apiService.config == null) {
      let _t: any | undefined = await this.utilities.sleep(1000);
    }
    let url = this.apiService.config["company"].api.userById;
    this.apiService.subscribeData(url, data, cb)
  }

  public async save(data: any, cb) {
    if (this.apiService.config == null) {
      let _t: any | undefined = await this.utilities.sleep(1000);
    }
    let url = this.apiService.config["company"].api.userSave;
    this.apiService.subscribeData(url, data, cb)
  }

  //pwd
  public async modify(data: any, cb) {
    if (this.apiService.config == null) {
      let _t: any | undefined = await this.utilities.sleep(1000);
    }
    let url = this.apiService.config["company"].api.userModifyPwd;
    this.apiService.subscribeData(url, data, cb)
  }

  public async delete(data: any, cb) {
    if (this.apiService.config == null) {
      let _t: any | undefined = await this.utilities.sleep(1000);
    }
    let url = this.apiService.config["company"].api.userDelete;
    this.apiService.subscribeData(url, data, cb)
  }

}

@Injectable()
export class LoginService {
  protected configUrl = 'assets/config.json';
  public config: any;
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(protected http: HttpClient, protected cookieService: CookieService, protected utilities: UtilitiesService, protected router: Router) {
    (async () => {
      let configPromise = await this.fetchConfig().toPromise()
      this.config = configPromise;
    })();
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };

  protected fetchConfig(): Observable<any> {
    return this.http.get<any>(this.configUrl)
    /*.pipe(
      catchError(this.handleError)
    );*/
  }

  protected fetchData(data: any, url: string): Observable<any> {
    return this.http.post<any>(url, data, this.httpOptions)
      .pipe(catchError((error: any) => {
        if (error.status === 400) {
          this.utilities.createNotification('error', '错误提示', error.error.message);
          // this.router.navigateByUrl("/");
        }
        return throwError(error);
      }));
  }

  protected fetchData__(data: any, url: string): Observable<any> {
    let jwtToken = this.cookieService.get("jwtToken");
    let httpOptionsJwt = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.config["jwtParameter"].Authorization + jwtToken
      })
    };
    return this.http.post<any>(url, data, httpOptionsJwt)
      .pipe(catchError((error: any) => {
        if (error.status === 400) {
          this.utilities.createNotification('error', '错误提示', error.error.message);
          // this.router.navigateByUrl("/");
        }
        return throwError(error);
      }));
  }

  public subscribeData(url: string, data: any, cb): void {
    this.fetchData(data, url).subscribe((data: any) => {
      cb && cb(data)
    });
  }

  public async getUserInfo(data: any, cb) {
    if (this.config == null) {
      let _t: any | undefined = await this.utilities.sleep(1000);
    }
    let url = this.config["user"].api.userInfo;
    this.fetchData__(data, url).subscribe((data: any) => {
      cb && cb(data)
    });
  }

  public async login(data: any, cb) {
    if (this.config == null) {
      let _t: any | undefined = await this.utilities.sleep(1000);
    }
    let url = this.config["user"].api.jwt;
    this.subscribeData(url, data, cb)
  }

}
