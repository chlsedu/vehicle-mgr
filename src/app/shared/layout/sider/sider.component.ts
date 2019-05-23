import {Component, Input, OnInit} from '@angular/core';
import {MenuService} from "../../../provider/menu.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.less']
})
export class SiderComponent implements OnInit {
  @Input() isCollapsed;
  triggerTemplate = null;
  menus;

  constructor(
    private menu: MenuService, private router: Router
  ) {
  }

  ngOnInit() {
    this.menus = this.menu.menus();
    var i = 0;
  }

  public isLinkActive(url: string): boolean {
    let charPos = this.router.url.indexOf('?');
    let cleanUrl = charPos !== -1 ? this.router.url.slice(0, charPos) : this.router.url;
    return (cleanUrl === url);
  }
}
