import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  resize = document.body.clientWidth;
  isCollapsed = false;
  @Output() nzCollapsed = new EventEmitter<void>();

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit() {
    fromEvent(window, 'resize')
      .subscribe((e) => {
        this.resize = e.currentTarget['innerWidth'];
      });
  }

  changeIcon() {
    this.isCollapsed = !this.isCollapsed;
    this.nzCollapsed.emit();
  }

  logout() {
    // this.tokenService.clear();
    this.router.navigateByUrl('/login');
  }
}
