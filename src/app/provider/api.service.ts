import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected configUrl = 'assets/config.json';
  protected config: any;
  protected httpOptionsOauth;
  protected httpOptions;
  protected access_token;

  constructor(protected http: HttpClient) {
    (async () => {
      let configPromise = await this.fetchConfig().toPromise()
      this.config = configPromise;
      this.httpOptionsOauth = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.config["oauthParameter"].Authorization
        })
      };
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
    })();
    /*while (true) {
      break;
    }*/
    // this.getConfig();
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
    if (isOauth) _url = url + '?access_token=' + this.access_token;
    return _url;
  }

  // 0 requests made - .subscribe() not called.
  private fetchConfig(): Observable<any> {
    return this.http.get<any>(this.configUrl)
      .pipe(
        catchError(this.handleError)
      );
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserApi extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  private sleep(ms) {
    let x = new Promise((resolve) => setTimeout(resolve, ms));
    return x;
  }

  //The all query is by post way,not get,put or delete!
  private fetchData(data: any, url: string): Observable<any> {
    return this.http.post<any>(this.assemUrl(url, false), data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private subscribeData(url: string, data: any, cb): void {
    this.fetchData(data, url).subscribe((data: any) => {
      if (data.code != 0) {
        cb && cb(null, data)
      } else {
        cb && cb(data)
      }
    });
  }

  public async getData(data: any, cb) {
    if (this.config == null) {
      let _t: any | undefined = await this.sleep(1000);
    }
    let url = this.config["company"].api.user;
    this.subscribeData(url, data, cb)
  }

  public async getDataById(data: any, cb) {
    if (this.config == null) {
      let _t: any | undefined = await this.sleep(1000);
    }
    let url = this.config["company"].api.userById;
    this.subscribeData(url, data, cb)
  }

  public async save(data: any, cb) {
    if (this.config == null) {
      let _t: any | undefined = await this.sleep(1000);
    }
    let url = this.config["company"].api.userSave;
    this.subscribeData(url, data, cb)
  }

  //pwd
  public async modify(data: any, cb) {
    if (this.config == null) {
      let _t: any | undefined = await this.sleep(1000);
    }
    let url = this.config["company"].api.userModifyPwd;
    this.subscribeData(url, data, cb)
  }

  public async delete(data: any, cb) {
    if (this.config == null) {
      let _t: any | undefined = await this.sleep(1000);
    }
    let url = this.config["company"].api.userDelete;
    this.subscribeData(url, data, cb)
  }

}
