import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';

import {AuthService} from './auth.service';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {
    /*let t = this.cookieService.get("data");
    if (t != "") {
      let cookieData = JSON.parse(t);
      this.authService.auths = cookieData.auths;
      if (this.authService.auths != null) this.authService.isLoggedIn = true;
    }*/
    this.doCheckPrePost()
  }

  doCheckPrePost() {
    let t = this.cookieService.get("data");
    if (t != "") {
      let cookieData = JSON.parse(t);
      this.authService.auths = cookieData.auths;
      if (this.authService.auths != null) this.authService.isLoggedIn = true;
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.auths == null)
      this.doCheckPrePost()
    let url: string = state.url;
    let permission: string | null = next.data["permission"];
    return this.checkLogin(permission, url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(permission, url: string): boolean {
    if (this.authService.isLoggedIn) {
      if (permission == null || this.authService.auths.indexOf(permission) != -1) {
        return true;
      }
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    // return true;
    this.router.navigate(['/login']);
    return false;
  }
}
