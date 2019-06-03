import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReuseTabComponent} from "./reuse-tab.component";
import {NzIconModule} from "ng-zorro-antd";

@NgModule({
  declarations: [ReuseTabComponent],
  imports: [
    CommonModule,
    NzIconModule,
  ],
  exports: [ReuseTabComponent]
})
export class ReuseTabModule {
}
