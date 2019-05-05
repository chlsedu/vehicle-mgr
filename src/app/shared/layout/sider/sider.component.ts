import {Component, Input, OnInit} from '@angular/core';
import {MenuService} from "../../../provider/menu.service";

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
    private menu: MenuService
  ) {
  }

  ngOnInit() {
    this.menus = this.menu.menus();
    var i = 0;
  }
}
