import { Component, OnInit } from '@angular/core';
import {BillersService} from '../../../shared/services/billers-service/billers.service';
import {NotificationService} from '../../../shared/services/notification.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private _billerService: BillersService, private _notificationService: NotificationService) { }

  public billers: Array<any> = [];

  public state = {
    loader: false
  };

  ngOnInit() {
    this.getBillers();
  }

  public getBillers(): void {
    this.state.loader = true;
    this._billerService.getAllBillers().subscribe(
      res => {
        this.state.loader = false;
        this.billers = Object.keys(res.data).reduce((acc, a) => acc.concat(res.data[a]), []);
      }, err => {
        this.state.loader = false;
        console.error(err);
      }
    );
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

}
