import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from "../provider/api.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

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
        this.router.navigateByUrl("/");
      })()))
    })
  }

  constructor(private fb: FormBuilder, private loginService: LoginService, private cookieService: CookieService, private router: Router) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

}
