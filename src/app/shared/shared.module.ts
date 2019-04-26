import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
  ],
  exports: [
    CommonModule,
    FormsModule,
    ComponentsModule
  ],
  entryComponents: [],
})
export class SharedModule {}
