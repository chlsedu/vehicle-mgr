import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from "../provider/api.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  public errorMsg: string;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.loginService.login(this.validateForm.value, (success) => {
      (success && ((() => {
        this.validateForm.value.remember && this.cookieService.set("jwtToken", success.token, 7);
        this.loginService.getUserInfo({}, (success) => {
          (success && ((() => {
            // this.validateForm.value.remember && this.cookieService.set("jwtToken", success.token, 7);
            this.validateForm.value.remember && this.cookieService.set("data", JSON.stringify(success.data), 7);
            // Get the redirect URL from our auth service
            // If no redirect has been set, use the default
            let redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/basic';
            // let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/basic';
            // this.authService.isLoggedIn = true;
            // Redirect the user
            this.router.navigateByUrl(redirect);
            // this.router.navigate([redirect], {queryParams: {"userName": "chls888"}});
            // this.router.navigateByUrl("/");

          })()))
        })
      })()))
    })
  }

  constructor(private fb: FormBuilder, private loginService: LoginService, private cookieService: CookieService, private router: Router, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

}
