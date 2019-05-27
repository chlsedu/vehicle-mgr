import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';
import {Injectable} from '@angular/core';
import {ReuseTabService} from "./reuse-tab.service";
import {parent_url_dict} from "../utilities/utilities";
// import {parent_url_dict} from "../utilities/utilities";

interface IRouteConfigData {
  reuse: boolean;
}

interface ICachedRoute {
  handle: DetachedRouteHandle;
  data: IRouteConfigData;
}

@Injectable(
  // {providedIn: 'root'}
)
export class ReuseTabStrategy implements RouteReuseStrategy {

  /*constructor(private srv: ReuseTabService) {
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return this.srv.shouldReuseRoute(future, curr);
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.srv.shouldDetach(route);
  }

  store(route: ActivatedRouteSnapshot, handle: {}): void {
    this.srv.store(route, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.srv.shouldAttach(route);
  }

  retrieve(route: ActivatedRouteSnapshot): {} | null {
    return this.srv.retrieve(route);
  }*/

  private static routeCache = new Map<string, ICachedRoute>();
  private static waitDelete: string;
  private static currentDelete: string;

  constructor(
    private service: ReuseTabService,
  ) {
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    this.setParentOrChildOnlyOneExit(future, curr);
    // ======this.service.store(future);
    this.service.store(future);
    if (future.routeConfig && future.routeConfig.path.indexOf(':id') !== -1) {
      if (future.params['id'] !== curr.params['id']) {
        return false;
      }
    }
    let next: boolean = future.routeConfig === curr.routeConfig
    return next;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const data = this.getRouteData(route);
    if (data) {
      return true;
    }
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.service.store(route);
    const url = this.getFullRouteUrl(route);
    const data = this.getRouteData(route);
    if (ReuseTabStrategy.waitDelete && ReuseTabStrategy.waitDelete === url) {
      ReuseTabStrategy.waitDelete = null;
      return null;
    } else {
      if (ReuseTabStrategy.currentDelete && ReuseTabStrategy.currentDelete === url) {
        ReuseTabStrategy.currentDelete = null;
        return null;
      } else {
        this.setChildOnlyOneExit(url);
        ReuseTabStrategy.routeCache.set(url, {handle, data});
        this.addRedirectsRecursively(route);

      }
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteUrl(route);
    console.log(url);
    // this.service.store(route);
    return ReuseTabStrategy.routeCache.has(url);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const url = this.getFullRouteUrl(route);
    const handle = ReuseTabStrategy.routeCache.has(url)
      ? ReuseTabStrategy.routeCache.get(url).handle
      : null;
    return handle;

  }

  private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
    const config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        const routeFirstChild = route.firstChild;
        const routeFirstChildUrl = routeFirstChild ? this.getRouteUrlPaths(routeFirstChild).join('/') : '';
        const childConfigs = config.children;
        if (childConfigs) {
          const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
          if (childConfigWithRedirect) {
            childConfigWithRedirect.redirectTo = routeFirstChildUrl;
          }
        }
      }
      route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
    }
  }

  private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
    return this.getFullRouteUrlPaths(route).join('/');
  }

  private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    const paths = this.getRouteUrlPaths(route);
    return route.parent ? [...this.getFullRouteUrlPaths(route.parent), ...paths] : paths;
  }

  private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    return route.url.map(urlSegment => urlSegment.path);
  }

  private getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
    return route.routeConfig && route.routeConfig.data as IRouteConfigData;
  }

  public deleteRouteSnapshot(url: string): void {
    if (url[0] === '/') {
      url = url.substring(1);
    }
    if (ReuseTabStrategy.routeCache.has(url)) {
      ReuseTabStrategy.routeCache.delete(url);
      ReuseTabStrategy.currentDelete = url;
    } else {
      ReuseTabStrategy.waitDelete = url;
    }
  }

  public removeRouteCacheByUrlPattern(pattern: string, url?) {
    const patternReg = new RegExp(pattern);
    const keyIterator = ReuseTabStrategy.routeCache.keys();
    let key = keyIterator.next();
    while (!key.done) {
      if (key.value !== url) {
        if (patternReg.test(key.value)) {
          this.deleteRouteSnapshot(key.value);
        }
      }
      key = keyIterator.next();
    }
  }

  public setParentOrChildOnlyOneExit(future, curr) {
    const currentUrl = this.getFullRouteUrl(future);
    for (const url of Object.keys(parent_url_dict)) {
      const future_url = this.service.getUrl(future);
      const curr_url = this.service.getUrl(curr);
      const regexArray = parent_url_dict[url];
      const parentRegex = new RegExp(regexArray[0]);
      const childRegex = new RegExp(regexArray[1]);
      if ((parentRegex.test(curr_url) && childRegex.test(future_url)) || (parentRegex.test(future_url) && childRegex.test(curr_url))) {
        this.service.close(url, true);
        if (new RegExp(regexArray[0]).test(url)) {
          this.removeRouteCacheByUrlPattern(regexArray[1], url);
          this.service.closeByRegex(regexArray[1], url);
        }
      }
    }
  }

  public setChildOnlyOneExit(url) {
    url = '/' + url;
    for (const parentUrl of Object.keys(parent_url_dict)) {
      const regexArray = parent_url_dict[parentUrl];
      if (new RegExp(parentUrl).test(url)) {
        if (new RegExp(regexArray[1]).test(url)) {
          this.removeRouteCacheByUrlPattern(regexArray[1], url);
          this.service.closeByRegex(regexArray[1], url);
        }
      }
    }
  }

}
