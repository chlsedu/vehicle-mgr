import {Injectable} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd";

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(private notification: NzNotificationService) {
  }

  public sleep(ms) {
    let x = new Promise((resolve) => setTimeout(resolve, ms));
    return x;
  }

  public createNotification(type: string, title: string, content: string): void {
    this.notification.create(
      type,
      title,
      content
    );
  }
}
