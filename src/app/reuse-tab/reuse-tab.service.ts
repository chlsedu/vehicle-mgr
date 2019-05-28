import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ActivatedRouteSnapshot, DetachedRouteHandle} from "@angular/router";
import {closeRegexs} from "../utilities/utilities";

@Injectable({
  providedIn: 'root'
})
export class ReuseTabService {

  private _cachedChange: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _cached: any[] = [];
  private removeUrlBuffer: string;
  private _titleCached: { [url: string]: string } = {};
  private executeCount = 1;

  /*=========*/

  /**
   * 决定是否应该进行复用路由处理
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const ref = this.executeCount++;
    // if (ref == 1)
    if (future.routeConfig == null) this.__store(future);// special requirement handling 手动存当前路由，store存的是上一个路由的最后节点实例
    let ret = future.routeConfig === curr.routeConfig;
    if (!ret) return false;

    const path = ((future.routeConfig && future.routeConfig.path) || '') as string;
    if (path.length > 0 && ~path.indexOf(':')) {
      const futureUrl = this.getUrl(future);
      const currUrl = this.getUrl(curr);
      ret = futureUrl === currUrl;
    }
    this.di('=====================');
    this.di('#shouldReuseRoute', ret, `${this.getUrl(curr)}=>${this.getUrl(future)}`, future, curr);
    return ret;
  }

  /** 排除规则，限 `mode=URL` */
  excludes: RegExp[] = [];
  debug = true;

  /**
   * 决定是否允许路由复用，若 `true` 会触发 `store`
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (this.hasInValidRoute(route)) return false;
    this.di('#shouldDetach', this.can(route), this.getUrl(route));
    return this.can(route);
  }

  /**
   * 存储
   */
  /** 获取当前缓存的路由总数 */
  private _max = 10;

  get count() {
    return this._cached.length;
  }

  store(_snapshot: ActivatedRouteSnapshot, _handle: DetachedRouteHandle): void {
    const url = this.getUrl(_snapshot);
    const idx = this.index(url);
    const rootRouter = this.getRootRouter(_snapshot);
    let item = {};
    if (rootRouter.data.title) {
      item = {
        title: rootRouter.data.title,
        url,
        isSelect: false,
        reuse: true,
      };
      // this._cached.forEach(p => p.isSelect = false);
      if (idx === -1) {
        this._cached.push(item);
      } else {
        this._cached[idx] = item;
      }
      this.removeUrlBuffer = null;

      this._cachedChange.next({active: 'add', item, list: this._cached});
    }

    /*const url = this.getUrl(_snapshot);
    const idx = this.index(url);
    const rootRouter = this.getRootRouter(_snapshot);
    const item = {
      url,
      _snapshot,
      _handle,
      title: rootRouter.data.title,
      isSelect: true,
      reuse: true,
    };
    if (idx === -1) {
      if (this.count >= this._max) {
        // Get the oldest closable location
        const closeIdx = this._cached.findIndex(w => w.closable!);
        if (closeIdx !== -1) this.remove(closeIdx, false);
      }
      this._cached.push(item);
    } else {
      this._cached[idx] = item;
    }
    this.removeUrlBuffer = null;

    this.di('#store', idx === -1 ? '[new]' : '[override]', url);

    if (_handle && _handle.componentRef) {
      this.runHook('_onReuseDestroy', url, _handle.componentRef);
    }

    this._cachedChange.next({active: 'add', item, list: this._cached});*/
  }

  __store(_snapshot: ActivatedRouteSnapshot): void {
    const url = this.getUrl(_snapshot);
    const idx = this.index(url);
    const rootRouter = this.getRootRouter(_snapshot);
    let item = {};
    if (rootRouter.data.reuse && rootRouter.data.title) {
      item = {
        title: rootRouter.data.title,
        url,
        isSelect: true,
        reuse: true,
      };
      this._cached.forEach(p => p.isSelect = false);
      if (idx === -1) {
        this._cached.push(item);
      } else {
        this._cached[idx] = item;
      }
      this.removeUrlBuffer = null;

      this._cachedChange.next({active: 'add', item, list: this._cached});
    }
  }

  /**
   * 决定是否允许应用缓存数据
   */
  /** 获取指定路径缓存 */
  get(url?: string): any | null {
    return url ? this._cached.find(w => w.url === url) || null : null;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (this.hasInValidRoute(route)) return false;
    const url = this.getUrl(route);
    const data = this.get(url);
    const ret = !!(data && data._handle);
    this.di('#shouldAttach', ret, url);
    /*if (ret && data!._handle.componentRef) {
      this.runHook('_onReuseInit', url, data!._handle.componentRef);
    }*/
    return ret;
  }

  /**
   * 提取复用数据
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (this.hasInValidRoute(route)) return null;
    const url = this.getUrl(route);
    const data = this.get(url);
    const ret = (data && data._handle) || null;
    this.di('#retrieve', url, ret);
    return ret;
  }

  /*private runHook(method: string, _url: string, comp: any) {
    if (comp.instance && typeof comp.instance[method] === 'function') comp.instance[method]();
  }*/

  private hasInValidRoute(route: ActivatedRouteSnapshot) {
    return !route.routeConfig || route.routeConfig.loadChildren || route.routeConfig.children;
  }

  private di(...args) {
    if (!this.debug) return;
    // tslint:disable-next-line:no-console
    console.warn(...args);
  }

  /**
   * 检查快照是否允许被复用
   */
  /**
   * 根据快照获取URL地址
   */
  getUrl(route: ActivatedRouteSnapshot): string {
    let next = this.getTruthRoute(route);
    const segments: string[] = [];
    while (next) {
      segments.push(next.url.join('/'));
      next = next.parent!;
    }
    const url =
      '/' +
      segments
        .filter(i => i)
        .reverse()
        .join('/');
    return url;
  }

  can(route: ActivatedRouteSnapshot): boolean {
    const url = this.getUrl(route);
    if (url === this.removeUrlBuffer) return false;

    if (route.data && typeof route.data.reuse === 'boolean') return route.data.reuse;

    return this.excludes.findIndex(r => r.test(url)) === -1;
  }

  /*=========*/
  constructor() {
  }

  get items(): any[] {
    return this._cached;
  }

  set items(menuList) {
    this._cached = menuList;
  }

  get change(): Observable<any> {
    return this._cachedChange.asObservable(); // .pipe(filter(w => w !== null));
  }

  private remove(url: string | number, includeNonCloseable: boolean): boolean {
    const idx = typeof url === 'string' ? this.index(url) : url;
    const item = idx !== -1 ? this._cached[idx] : null;
    if (!item || (!includeNonCloseable && !item.closable)) {
      return false;
    }

    this.destroy(item._handle);

    this._cached.splice(idx, 1);
    delete this._titleCached[url];
    return true;
  }

  close(url: string, includeNonCloseable = false) {
    this.removeUrlBuffer = url;

    this.remove(url, includeNonCloseable);

    this._cachedChange.next({active: 'close', url, list: this._cached});

    return true;
  }


  closeByRegex(pattern, url?) {
    const newCache: any[] = [];
    const urlRegex = new RegExp(pattern);
    for (let i = 0; i < this._cached.length; i++) {
      const cache = this._cached[i];
      const matchFlag = urlRegex.test(cache.url);
      if (cache.url === url) {
        newCache.push(cache);
      } else {
        if (matchFlag) {

        } else {
          newCache.push(cache);
        }
      }
    }
    this._cached = newCache;
    this._cachedChange.next({active: 'close', list: this._cached});
  }

  closeAllByRegex(url) {
    for (const regexStr of closeRegexs) {
      const regex = new RegExp(regexStr);
      if (regex.test(url)) {
        this.closeByRegex(regexStr);
        break;
      }
    }
  }

  /*store(_snapshot: ActivatedRouteSnapshot) {
    const url = this.getUrl(_snapshot);
    const idx = this.index(url);
    const rootRouter = this.getRootRouter(_snapshot);
    let item = {};
    if (rootRouter.data.title) {
      item = {
        title: rootRouter.data.title,
        url,
        isSelect: true,
        reuse: true,
      };
      this._cached.forEach(p => p.isSelect = false);
      if (idx === -1) {
        this._cached.push(item);
      } else {
        this._cached[idx] = item;
      }
      this.removeUrlBuffer = null;

      this._cachedChange.next({active: 'add', item, list: this._cached});
    }

  }*/

  index(url: string): number {
    return this._cached.findIndex(w => w.url === url);
  }

  private destroy(_handle: any) {
    if (_handle && _handle.componentRef && _handle.componentRef.destroy) {
      _handle.componentRef.destroy();
    }
  }

  /*getUrl(route: ActivatedRouteSnapshot): string {
    let next = this.getTruthRoute(route);
    const segments = [];
    while (next) {
      segments.push(next.url.join('/'));
      next = next.parent;
    }
    const url =
      '/' +
      segments
        .filter(i => i)
        .reverse()
        .join('/');
    return url;
  }*/

  getTruthRoute(route: ActivatedRouteSnapshot) {
    let next = route;
    while (next.firstChild) {
      next = next.firstChild;
    }
    return next;
  }

  /*private runHook(method: string, url: string, comp: any) {
    if (comp.instance && typeof comp.instance[method] === 'function') {
      comp.instance[method]();
    }
  }*/

  getRootRouter(route: ActivatedRouteSnapshot) {
    if (route.children.length > 0) {
      route = route.children[0];
      return this.getRootRouter(route);
    } else {
      return route;
    }
  }

  // removeUnReuseTab(url) {
  //   for (let i=0;i<this._cached.length;i++) {
  //     let cache = this._cached[i];
  //     if(cache.url = url && !cache.reuse) {
  //       this._cached.splice(i,1);
  //       this._cachedChange.next({ active: 'close', list: this._cached });
  //       break;
  //     }
  //   }

  // }
}
