import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  // {path: '', loadChildren: './route/route.module#RouteModule',},
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
  },
  {
    path: 'basic',
    // canActivate: [AuthGuard],
    loadChildren: './basic/basic.module#BasicModule',
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
