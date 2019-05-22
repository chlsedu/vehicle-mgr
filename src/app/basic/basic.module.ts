import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicComponent} from './basic.component';
import {RouterModule} from "@angular/router";
import {UserComponent} from "./user/user.component";
import {RoleComponent} from "./role/role.component";
import {AuthComponent} from "./auth/auth.component";
import {SharedModule} from "../shared/shared.module";
import {AuthGuard} from "../auth/auth.guard";

@NgModule({
  declarations: [BasicComponent, UserComponent, RoleComponent, AuthComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', redirectTo: 'child', pathMatch: 'full'},
      {
        path: 'child',
        canActivateChild: [AuthGuard],
        component: BasicComponent,
        children: [
          {path: '', redirectTo: 'user', pathMatch: 'full'},
          {path: 'user', component: UserComponent},
          {path: 'role', component: RoleComponent},
          {path: 'auth', component: AuthComponent},
        ]
      },
    ]),
    SharedModule,
  ],
  // exports: [RouterModule]
})
export class BasicModule {
}
