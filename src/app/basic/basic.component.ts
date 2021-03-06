import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subscription} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ReuseTabService} from "../reuse-tab/reuse-tab.service";
import {filter, map, mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit, OnDestroy {

  isCollapsed = false;
  date = new Date().getFullYear();

  launchSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
  }

  /*====*/
  private sub$: Subscription;
  menuList: Array<{ title: string, url: string, isSelect: boolean }> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private reuseTabSrv: ReuseTabService,
  ) {
    const route$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    );
    this.sub$ = combineLatest(this.reuseTabSrv.change, route$).subscribe(([res, e]) => {
      this.genList(res);
    });

  }

  genList(res) {
    if (res) {
      console.log(res);
      this.menuList = res.list;
      if (res.active == "close") {
        try {
          res.list.forEach(p => {
            if (p.isSelect) {
              this.router.navigate(['/' + p.url]);
              // throw new Error("break!") //also prevent "shouldReuseRoute",all entire RouteReuseStrategy,so do unused
            }
          });
        } catch (e) {
        }
      } else {
      }
    }
  }

  ngOnDestroy(): void {
    const {sub$} = this;
    if (sub$) {
      sub$.unsubscribe();
    }
  }
}
