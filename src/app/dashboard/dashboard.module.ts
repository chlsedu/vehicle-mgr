import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule} from "@angular/router";
import {NzMessageModule} from "ng-zorro-antd";
import {SharedModule} from "../shared/shared.module";
import {ReuseTabModule} from "../reuse-tab/reuse-tab.module";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    NzMessageModule,
    SharedModule,
    ReuseTabModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        data: {title: '统计分析', reuse: true},
        component: DashboardComponent
      },
    ]),
  ]
})
export class DashboardModule {
}
