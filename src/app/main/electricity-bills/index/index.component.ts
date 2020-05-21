import { Component, OnInit } from '@angular/core';
import { BillersService } from 'src/app/shared/services/billers-service/billers.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {Session} from '../../../shared/utilities/session';
import {trimStringToCase} from '../../../shared/utilities/helper';
import {Router} from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private _billerservices: BillersService,
              private _notificationServices: NotificationService,
              private _router: Router) { }

  public req = {
    service_type: 'electricity'
  };
  public payload = {
    data: []
  };

  public state = {
    billerRequest: false,
    selectedCategory: '',
    loader: {
      billers: false
    }
  };

  ngOnInit() {
    this.getCableBillers();
  }



  public getCableBillers() {
    this.state.loader.billers = true;
    this._billerservices.getBillersByCategory(this.req).subscribe(res => {
      this.state.loader.billers = false;
      this.payload.data = res.data;
      console.log(res);
    }, err => {
      this.state.loader.billers = false;
      console.log(err + '=========');
      this._notificationServices.showError('failed to fetch');
    });

  }

  /**
   *
   * @param name
   */
  public filterGeneteratedBiller(name: string): void {
    const boxes = (document.getElementsByClassName('biller-box') as HTMLCollection);
    Array.from(boxes).filter((el) => {
      const param1 = el.lastElementChild.firstElementChild.firstElementChild.textContent.toLowerCase();
      const param2 = el.lastElementChild.lastElementChild.firstElementChild.textContent.toLowerCase();
      if (param1.indexOf(name.toLowerCase()) !== -1 || param2.indexOf(name.toLowerCase()) !== -1) {
        (el as HTMLElement).style.display = 'flex';
      } else {
        (el as HTMLElement).style.display = 'none';
      }
    });
  }

  /**
   *
   * @param payload
   */
  public selectBiller(payload): void {
    Session.set('BILLER_DATA', payload);
    this._router.navigate([`${trimStringToCase(payload['serviceBiller'], 'LOWER')}`]);
  }
}

