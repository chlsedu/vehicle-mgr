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
    this.reuseTabService.close(url);
  }
}
