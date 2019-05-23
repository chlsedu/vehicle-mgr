import {Component, OnInit} from '@angular/core';
import {UserApiService} from "../../provider/api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public userList: any;
  public errorMsg: string;

  constructor(private userApiService: UserApiService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let queryParams: any = this.route.snapshot.queryParams;
    let params: any = this.route.snapshot.params;
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
