import {Component, OnInit} from '@angular/core';
import {MenuService} from "../../../provider/menu.service";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {
  menus;

  constructor(
    private menu: MenuService
  ) {
  }

  ngOnInit() {
    this.menus = this.menu.menus();
  }

}
