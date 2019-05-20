import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() {
  }

  public sleep(ms) {
    let x = new Promise((resolve) => setTimeout(resolve, ms));
    return x;
  }
}
