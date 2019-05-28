import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';
import {Injectable} from '@angular/core';
import {ReuseTabService} from "./reuse-tab.service";


@Injectable(
  // {providedIn: 'root'}
)
export class ReuseTabStrategy implements RouteReuseStrategy {

  constructor(
    private service: ReuseTabService,
  ) {
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return this.service.shouldReuseRoute(future, curr);
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.service.shouldDetach(route);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.service.store(route, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.service.shouldAttach(route);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.service.retrieve(route);
  }

}
