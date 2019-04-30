import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() {
  }

  _Menus = [
    {
      text: '首页',
      link: 'index',
      icon: 'home',
      children: []
    },
    {
      text: '图表',
      link: '',
      icon: 'line-chart',
      children: [
        {
          text: '折线图',
          link: 'charts/line',
          icon: '',
        }
      ]
    }
  ];

  menus() {
    return this._Menus;
  }
}
