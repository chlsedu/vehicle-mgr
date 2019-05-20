import {Component, OnInit} from '@angular/core';
import {UserApiService} from "../../provider/api.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public userList: any;
  public errorMsg: string;

  constructor(private userApiService: UserApiService) {
  }

  ngOnInit() {
    this.userApiService.getData({}, (success, error) => {
      (success && ((() => {
        this.userList = success.data;
        return true;
      })())) || (error && ((() => {
        this.errorMsg = error.msg;
        return true;
      })()));
    })

  }

}
