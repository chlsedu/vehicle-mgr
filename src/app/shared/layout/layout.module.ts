import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {BreadcrumbComponent} from "./breadcrumb/breadcrumb.component";
import {HeaderComponent} from "./header/header.component";
import {SiderComponent} from "./sider/sider.component";
import {
  NzBreadCrumbModule,
  NzDropDownModule, NzFormModule,
  NzIconModule,
  NzInputModule,
  NzLayoutModule,
  NzMenuModule,
  NzTableModule,
  NzTabsModule,
} from 'ng-zorro-antd';

@NgModule({
  declarations: [BreadcrumbComponent, HeaderComponent, SiderComponent],
  imports: [
    CommonModule
    , RouterModule
    , NzLayoutModule
    , NzBreadCrumbModule
    , NzFormModule
    , NzMenuModule
    , NzDropDownModule
    , NzIconModule
    , NzInputModule
    , NzTableModule
    , NzTabsModule
  ],
  exports: [BreadcrumbComponent, HeaderComponent, SiderComponent,
    CommonModule
    , RouterModule
    , NzLayoutModule
    , NzBreadCrumbModule
    , NzFormModule
    , NzMenuModule
    , NzDropDownModule
    , NzIconModule
    , NzInputModule
    , NzTableModule
    , NzTabsModule
  ]
})
export class LayoutModule {
}
