import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET, Router} from "@angular/router";
import {filter} from "rxjs/operators";

interface IBreadcrumb {
  label: string;
  params?: Params;
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.less']
})

export class BreadcrumbComponent implements OnInit {

  public breadcrumbs: IBreadcrumb[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.breadcrumbs = [];
  }

  ngOnInit() {
    //subscribe to the NavigationEnd event
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      //set breadcrumbs
      let root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);

      //remove duplicate element by label
      //这个数组对象去重的方法很给力
      this.breadcrumbs = this.breadcrumbs.reduce((x, y) => x.findIndex(e => e.label == y.label) < 0 ? [...x, y] : x, []);

      console.log('%c breadcrumb list ：', 'background: #222; color: white');
      console.log(this.breadcrumbs);
    });

  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB: string = "title";
    //get the child routes
    let children: ActivatedRoute[] = route.children;
    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }
    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }
      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }
      //get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");
      //append route URL to URL
      url += `/${routeURL}`;
      /*console.log('%c url：', 'background: #222; color: red');
      console.log(url);*/
      //add breadcrumb
      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        // url: '/basic' + url
      };
      /*console.log('%c single breadcrumb：', 'background: #222; color: red');
      console.log(breadcrumb);*/
      breadcrumbs.push(breadcrumb);
      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    //we should never get here, but just in case
    return breadcrumbs;
  }

}
