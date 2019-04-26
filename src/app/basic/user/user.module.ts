import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared";
import {UserComponent} from "./user.component";

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserComponent
      }
    ])
  ],
})
export class UserModule { }
