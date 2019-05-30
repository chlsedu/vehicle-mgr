import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicComponent} from './basic.component';
import {RouterModule} from "@angular/router";
import {NzModalCustomComponent, UserComponent} from "./user/user.component";
import {RoleComponent} from "./role/role.component";
import {AuthComponent} from "./auth/auth.component";
import {SharedModule} from "../shared/shared.module";
import {AuthGuard} from "../auth/auth.guard";
import {UserEditComponent} from "./user/user-edit/user-edit.component";
import {ReuseTabComponent} from "../reuse-tab/reuse-tab.component";
import {NzModalModule} from "ng-zorro-antd";

@NgModule({
  declarations: [BasicComponent, UserComponent, RoleComponent, AuthComponent, UserEditComponent, ReuseTabComponent, NzModalCustomComponent],
  entryComponents: [NzModalCustomComponent],
  imports: [
    CommonModule,
    NzModalModule,
    RouterModule.forChild([
      {path: '', redirectTo: 'child', pathMatch: 'full'},
      {
        path: 'child',
        data: {title: '基础信息', reuse: true, isParentNode: true},
        canActivateChild: [AuthGuard],
        component: BasicComponent,
        children: [
          {path: '', redirectTo: 'user', pathMatch: 'full'},
          {
            path: 'user',
            component: UserComponent,
            data: {'permission': 'user', title: '用户管理', reuse: true},
            children: [
              {
                path: 'edit/:id',
                component: UserEditComponent,
                data: {'permission': 'user-edit', title: '用户管理--2', reuse: true}
              }
            ]
          },
          {
            path: 'user/:id',
            component: UserEditComponent,
            data: {title: '用户编辑', 'permission': 'user-edit'}
          },
          {
            path: 'role',
            component: RoleComponent,
            data: {title: '角色管理', reuse: true}
          },
          {
            path: 'auth',
            component: AuthComponent,
            data: {'permission': 'auth', title: '权限管理', reuse: true}
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
