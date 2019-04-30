import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BreadcrumbComponent} from "./breadcrumb/breadcrumb.component";
import {HeaderComponent} from "./header/header.component";
import {SiderComponent} from "./sider/sider.component";

@NgModule({
  declarations: [BreadcrumbComponent, HeaderComponent, SiderComponent],
  imports: [
    CommonModule
  ]
})
export class LayoutModule {
}
