import { Component, OnInit } from '@angular/core';
import {elementShowHide, scrollToDiv} from '../../../shared/utilities/helper';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public state = {
    isContinue: false
  };

  constructor() { }

  ngOnInit() {
    if (window.innerWidth <= 768 ) {
      elementShowHide('.right-section', 'HIDE');
    }
  }

  public isContinue(): void {

    if (window.innerWidth <= 768) {
      elementShowHide('.right-section', 'SHOW');
      scrollToDiv('send-money-pay-section', 500); // scroll to div when device is mobile
    }

  }

}
