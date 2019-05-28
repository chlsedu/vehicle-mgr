import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {ReuseTabService} from "./reuse-tab.service";

@Component({
  selector: 'app-reuse-tab',
  templateUrl: './reuse-tab.component.html',
  styleUrls: ['./reuse-tab.component.css']
})
export class ReuseTabComponent/* implements OnInit*/ {
  @Input('list') list;

  constructor(
    private router: Router,
    private reuseTabService: ReuseTabService,
    // private appReuseStrategy: AppReuseStrategy,
  ) {
  }

  to(event, item) {
    this.router.navigateByUrl(item.url);
    const currentUrl = this.router.routerState.snapshot.url;
    const regex = new RegExp('^/Parent/Child/');
    if (regex.test(currentUrl)) {
      for (const unit of this.list) {
        if (regex.test(unit.url)) {
          unit.url = currentUrl;
        }
        break;
      }
      console.log(this.list);
    }
  }

  closeUrl(url: string, isSelect: boolean, event: Event) {
    event.preventDefault();
    if (this.list.length === 1) {
      return;
    }
    this.reuseTabService.close(url);
    //

    /*const index = this.list.findIndex(p => p.url === url);
    this.list = this.list.filter(p => p.url !== url);
    // this.appReuseStrategy.deleteRouteSnapshot(url);
    // this.reusetabService.closeAllByRegex(url);
    if (!isSelect) {
      return;
    }
    let menu = this.list[index - 1];
    if (!menu) {
      menu = this.list[index];
    }
    this.list.forEach(p => p.isSelect = p.url === menu.url);
    this.router.navigate(['/' + menu.url]);*/
  }
}
