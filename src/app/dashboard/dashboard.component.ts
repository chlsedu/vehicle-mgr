import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd";
import {combineLatest, Subscription} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ReuseTabService} from "../reuse-tab/reuse-tab.service";
import {filter, map, mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  isCollapsed = false;
  date = new Date().getFullYear();

  launchSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  notice: any[] = [];
  activities: any[] = [];
  radarData: any[];
  loading = true;

  // region: mock data
  links = [
    {
      title: '操作一',
      href: '',
    },
    {
      title: '操作二',
      href: '',
    },
    {
      title: '操作三',
      href: '',
    },
    {
      title: '操作四',
      href: '',
    },
    {
      title: '操作五',
      href: '',
    },
    {
      title: '操作六',
      href: '',
    },
  ];
  members = [
    {
      id: 'members-1',
      title: '科学搬砖组',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      link: '',
    },
    {
      id: 'members-2',
      title: '程序员日常',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      link: '',
    },
    {
      id: 'members-3',
      title: '设计天团',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      link: '',
    },
    {
      id: 'members-4',
      title: '中二少女团',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      link: '',
    },
    {
      id: 'members-5',
      title: '骗你学计算机',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      link: '',
    },
  ];

  // endregion

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
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef
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
