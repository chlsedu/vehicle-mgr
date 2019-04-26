import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponent } from './basic.component';
import {RouterModule} from "@angular/router";
import {UserComponent} from "./user/user.component";
import {RoleComponent} from "./role/role.component";
import {AuthComponent} from "./auth/auth.component";

@NgModule({
  declarations: [BasicComponent,UserComponent,RoleComponent,AuthComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      {path: 'user',component: UserComponent},
      {path: 'role',component: RoleComponent},
      {path: 'auth',component: AuthComponent},
    ])
  ],
  // exports: [RouterModule]
})
export class BasicModule { }
