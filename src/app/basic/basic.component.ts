import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {

  isCollapsed = false;
  triggerTemplate = null;
  date;

  constructor() {
  }

  launchSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
    const date = new Date();
    this.date = date.getFullYear();
  }
}
