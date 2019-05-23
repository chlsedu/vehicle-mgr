import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicComponent} from './basic.component';
import {RouterModule} from "@angular/router";
import {UserComponent} from "./user/user.component";
import {RoleComponent} from "./role/role.component";
import {AuthComponent} from "./auth/auth.component";
import {SharedModule} from "../shared/shared.module";
import {AuthGuard} from "../auth/auth.guard";
import {UserEditComponent} from "./user/user-edit/user-edit.component";

@NgModule({
  declarations: [BasicComponent, UserComponent, RoleComponent, AuthComponent, UserEditComponent],
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
          {
            path: 'user',
            component: UserComponent,
            data: {'permission': 'user'},
            children: [
              {
                path: 'edit/:id',
                component: UserEditComponent,
                data: {'permission': 'user-edit'}
              }
            ]
          },
          {
            path: 'user/:id',
            component: UserEditComponent,
            data: {'permission': 'user-edit'}
          },
          {
            path: 'role',
            component: RoleComponent,
            // data: {'permission': 'role'}
          },
          {
            path: 'auth',
            component: AuthComponent,
            data: {'permission': 'auth'}
          },
        ]
      },
    ]),
    SharedModule,
  ],
  // exports: [RouterModule]
})
export class BasicModule {
}
