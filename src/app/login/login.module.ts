import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login.component";
import {LoginService} from "../provider/api.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NZ_ICONS, NzButtonModule, NzCheckboxModule, NzFormModule, NzIconModule, NzInputModule} from "ng-zorro-antd";
import {RouterModule} from "@angular/router";
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    RouterModule.forChild([
      {path: '', pathMatch: 'full', component: LoginComponent},
    ]),
  ],
  providers: [LoginService, { provide: NZ_ICONS, useValue: icons }]
})
export class LoginModule {
}
