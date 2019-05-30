import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, Unsubscribable} from "rxjs";
import {ActivatedRouteSnapshot, DetachedRouteHandle} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class ReuseTabService implements OnDestroy {

  private _cachedChange: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _cached: any[] = [];
  private removeUrlBuffer: string;
  private executeCount = 1;
  private _router$: Unsubscribable;

  /*=========*/
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

  /** `mode=URL` */
  excludes: RegExp[] = [];
  debug = true;

  /**
   *
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (this.hasInValidRoute(route)) return false;
    this.di('#shouldDetach', this.can(route), this.getUrl(route));
    return this.can(route);
  }

  /**
   *
   */
  private _max = 10;

  get count() {
    return this._cached.length;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (handle != null) {//future store himself in the second process
      const url = this.getUrl(route);//_snapshot is the curr not future,store current leave component
      // if (this.removeUrlBuffer != url) {
      const idx = this.index(url);
      const rootRouter = this.getRootRouter(route);
      let item = {};
      if (rootRouter.data.title) {
        item = {
          title: rootRouter.data.title,
          route,
          handle,
          url,
          isSelect: false,
          reuse: true,
          closable: true,
        };
        // this._cached.forEach(p => p.isSelect = false);
        if (idx === -1) {
          this._cached.push(item);
        } else {
          this._cached[idx] = item;
        }
        this._cachedChange.next({active: 'add', item, list: this._cached});
        // }
      }
      this.removeUrlBuffer = null;
    }
  }

  __store(__route: ActivatedRouteSnapshot): void {
    const url = this.getUrl(__route);
    const idx = this.index(url);
    const rootRouter = this.getRootRouter(__route);
    let item = {};
    /*handle to been "store" not "__store",do not be overflowed by new null*/
    if (idx !== -1 && this._cached[idx].handle) {
      /*change "isSelect" state*/
      this._cached.forEach(p => p.isSelect = false);
      this._cached[idx].isSelect = true;
      this._cachedChange.next({active: 'add', item, list: this._cached});
      return;
    }
    /*==end out==*/
    if (rootRouter.data.reuse && rootRouter.data.title) {
      item = {
        title: rootRouter.data.title,
        url,
        isSelect: true,
        reuse: true,
        closable: true,
      };
      this._cached.forEach(p => p.isSelect = false);
      if (idx === -1) {
        if (this.count >= this._max) {
          // Get the oldest closable location
          const closeIdx = this._cached.findIndex(w => w.closable!);
          if (closeIdx !== -1) this.remove(closeIdx);
        }
        this._cached.push(item);
      } else {
        this._cached[idx] = item;
      }
      // this.removeUrlBuffer = null;
      this._cachedChange.next({active: 'add', item, list: this._cached});
    }
  }

  /**
   *
   */
  get(url?: string): any | null {
    return url ? this._cached.find(w => w.url === url) || null : null;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (this.hasInValidRoute(route)) return false;
    const url = this.getUrl(route);
    const data = this.get(url);
    const ret = !!(data && data.handle);
    this.di('#shouldAttach', ret, url);
    /*if (ret && data!.handle.componentRef) {
      this.runHook('_onReuseInit', url, data!.handle.componentRef);
    }*/
    return ret;
  }

  /**
   *
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (this.hasInValidRoute(route)) return null;
    const url = this.getUrl(route);
    const data = this.get(url);
    const ret = (data && data.handle) || null;
    this.di('#retrieve', url, ret);
    return ret;
  }

  private hasInValidRoute(route: ActivatedRouteSnapshot) {
    return !route.routeConfig || route.routeConfig.loadChildren || route.routeConfig.children;
  }

  private di(...args) {
    if (!this.debug) return;
    // tslint:disable-next-line:no-console
    console.warn(...args);
  }

  /**
   *
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

  get change(): Observable<any> {
    return this._cachedChange.asObservable(); // .pipe(filter(w => w !== null));
  }

  private remove(url: string | number): boolean {
    const idx = typeof url === 'string' ? this.index(url) : url;
    const item = idx !== -1 ? this._cached[idx] : null;
    if (!item || (!item.closable)) {
      return false;
    }
    item.handle && this.destroy(item.handle);
    let isSelect = item.isSelect;
    this._cached.splice(idx, 1);
    if (isSelect) this._cached[this._cached.length - 1].isSelect = true;
    return true;
  }

  close(url: string) {
    if (this._cached.length === 1) return false;
    this.removeUrlBuffer = url;
    this.remove(url);
    this._cachedChange.next({active: 'close', url, list: this._cached});
    return true;
  }

  index(url: string): number {
    return this._cached.findIndex(w => w.url === url);
  }

  private destroy(handle: any) {
    if (handle && handle.componentRef && handle.componentRef.destroy) {
      handle.componentRef.destroy();
    }
  }

  getTruthRoute(route: ActivatedRouteSnapshot) {
    let next = route;
    while (next.firstChild) {
      next = next.firstChild;
    }
    return next;
  }

  getRootRouter(route: ActivatedRouteSnapshot) {
    if (route.children.length > 0) {
      route = route.children[0];
      return this.getRootRouter(route);
    } else {
      return route;
    }
  }

  clear(includeNonCloseable = false) {
    this._cached.forEach(w => {
      if (!includeNonCloseable && w.closable) this.destroy(w._handle);
    });
    this._cached = this._cached.filter(w => !includeNonCloseable && !w.closable);

    this.removeUrlBuffer = null;

    this._cachedChange.next({active: 'clear', list: this._cached});

    this.di('clear all catch');
  }

  ngOnDestroy(): void {
    const {_cachedChange, _router$} = this;
    this.clear();
    this._cached = [];
    _cachedChange.complete();
    if (_router$) {
      _router$.unsubscribe();
    }
  }
}
