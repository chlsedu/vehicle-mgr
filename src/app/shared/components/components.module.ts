import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {BackHeaderComponent} from './back/back-header';
import {BackIconComponent} from './back/back-icon';
import {ElmSvgComponent} from './svg/svg';
import {LoadingComponent} from './loading/loading';

// import { DirectivesModule } from '../directives';
const coms: any[] = [
    BackHeaderComponent,
    BackIconComponent,
    ElmSvgComponent,
    LoadingComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
    ],
    declarations: [
        coms
    ],
    exports: [
        coms
    ],
    entryComponents: [],
})
export class ComponentsModule {
}
