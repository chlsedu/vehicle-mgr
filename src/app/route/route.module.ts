import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'basic',
        // canActivate: [AuthGuard],
        loadChildren: './basic/basic.module#BasicModule',
      },
      {
        path: 'login',
        loadChildren: './login/login.module#LoginModule',
      },
    ]),
  ]
})
export class RouteModule {
}
