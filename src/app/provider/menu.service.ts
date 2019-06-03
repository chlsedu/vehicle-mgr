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
      link: '/',
      icon: 'home',
      children: []
    },
    {
      text: '基础管理',
      link: '/base',
      icon: 'setting',
      children: [
        {
          text: '用户管理',
          link: 'user',
          icon: '',
        },
        {
          text: '角色管理',
          link: 'role',
          icon: '',
        },
        {
          text: '权限管理',
          link: 'auth',
          icon: '',
        }
      ]
    }
  ];

  menus() {
    return this._Menus;
  }
}
