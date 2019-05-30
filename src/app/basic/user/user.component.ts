import {Component, Input, OnInit} from '@angular/core';
import {UserApiService} from "../../provider/api.service";
import {ActivatedRoute} from "@angular/router";
import {NzModalRef, NzModalService} from "ng-zorro-antd";
import {DragElement} from "../../utilities/utilities";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public userList: any;
  public errorMsg: string;

  constructor(private userApiService: UserApiService, private route: ActivatedRoute, private modalService: NzModalService) {
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

  createComponentModal(data: any): void {
    const modal = this.modalService.create({
      nzTitle: data,
      nzContent: NzModalCustomComponent,
      nzComponentParams: {
        title: data,
        subtitle: 'component sub title，will be changed after 2 sec'
      },
      nzFooter: [
        {
          label: 'change component tilte from outside',
          onClick: componentInstance => {
            componentInstance!.title = 'title in inner component is changed';
          }
        }
      ],
      nzWidth: "300px",
      nzStyle: {top: '90px', height: '0px'},
      nzBodyStyle: {maxHeight: '80px', 'overflow-y': 'auto'},
    });

    modal.afterOpen.subscribe(() => {
      const t = 0;
      console.log('[afterOpen] emitted!')
    });

    // Return a result when closed
    modal.afterClose.subscribe(result => {
      const t = 0;
      console.log('[afterClose] The result is:', result)
    });

    // delay until modal instance created
    setTimeout(() => {
      const instance = modal.getContentComponent();
      instance.subtitle = 'sub title is changed';
    }, 2000);
  }

}

@Component({
  selector: 'nz-modal-custom-component',
  styleUrls: ['./user.component.css'],
  template: `
    <div>
      <h2 class="m_i">{{ title }}</h2>
      <h4>{{ subtitle }}</h4>
      <p>
        <span>Get Modal instance in component</span>
        <button nz-button [nzType]="'primary'" (click)="destroyModal()">destroy modal in the component</button>
      </p>
    </div>
  `
})
export class NzModalCustomComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;

  constructor(private modal: NzModalRef) {
  }

  destroyModal(): void {
    this.modal.destroy({data: this.title});
  }

  ngOnInit(): void {
    let items = document.querySelectorAll(".ant-modal-content");
    items.forEach((item) => {
      let e = new DragElement(item);
      e.draggable();
    })
  }
}
