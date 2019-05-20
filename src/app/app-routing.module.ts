import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'basic', pathMatch: 'full'},
  {path: 'basic', loadChildren: './basic/basic.module#BasicModule',},
  {path: 'login', loadChildren: './login/login.module#LoginModule',},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
