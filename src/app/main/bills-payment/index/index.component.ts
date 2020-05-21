import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {elementShowHide, isArrayObjectSelected, scrollToDiv, trimStringToCase} from '../../../shared/utilities/helper';
import { BillersService } from 'src/app/shared/services/billers-service/billers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Session} from '../../../shared/utilities/session';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private _billerservices: BillersService,
              private _route: ActivatedRoute, private _router: Router) {}

  public state = {
    billerRequest: false,
    selectedCategory: '',
    loader: {
      billers: false
    },
    is404: false,
    isCategory: false
  };

  public payloads = {
    categories: [],
    billers: []
  };

  ngOnInit() {
    console.log(this._route.snapshot);
    if (this._route.snapshot.params.notFound) {
      this.state.selectedCategory = this._route.snapshot.params.notFound;
      this.state.is404 = true;
    } else {
      this.getBillers();
    }
    if (window.innerWidth <= 768 ) {
      elementShowHide('.right-section', 'HIDE');
    }
    // get Biller Categories on page load
    this.getBillerCategories();
  }

  /**
   * @description get All Biller Categories
   */
  private getBillerCategories(): void {
    // start loader
    this._billerservices.getAllBillerCategories().subscribe(
      res => {
        this.payloads.categories = res.data;
      }, err => {
        console.error(err);
      }
    );
  }

  public billerFormResultShowHide () {
    
  }

  /**
   * @description get billers by selected category
   * @param payload
   * @param index
   */
  public getBillersByCategoryType(payload: object, index): void {

    if (this.state.is404) {
      this.state.is404 = false;
    }
    this.state.isCategory = true;
    this.payloads.billers = [];

    // first let make the selected category active
    isArrayObjectSelected(this.payloads.categories, 'active');

    this.payloads.categories[index].active = true;

    // show loading dialog

    if (window.innerWidth <= 768) {
      elementShowHide('.right-section', 'SHOW');
      scrollToDiv('biller-cat-search-container', 500); // scroll to div when device is mobile
    }
    // set selected biller category name as the service Type
    this.state.selectedCategory = payload['name'];
    this.state.loader.billers = true;
    this._billerservices.getBillersByCategory({service_type: payload['service_type']}).subscribe(res => {
        this.state.loader.billers = false;
        this.payloads.billers = res.data;
      }, err => {
        this.state.loader.billers = false;
        console .error(err);
      }
    );
  }

  private getBillers(): void {
    this.state.loader.billers = true;
    this._billerservices.getAllBillers().subscribe(
      res => {
        this.state.loader.billers = false;
        this.payloads.billers = Object.keys(res.data).reduce((acc, a) => acc.concat(res.data[a]), []);
        // this.payloads.billers.sort((a, b) => a - b );
        // console.log(this.payloads.billers);
      }, err => {
        this.state.loader.billers = false;
        console.error(err);
      }
    );
  }

  public viewAllBiller(): void {
    this.payloads.billers = [];
    this.state.isCategory = false;
    isArrayObjectSelected(this.payloads.categories, 'active');
    this.getBillers();
  }

  /**
   *
   * @param payload
   */
  public selectBiller(payload): void {

    if (payload.serviceCategory === 'databundle' || payload.serviceCategory === 'airtime') {
      localStorage.setItem('selectedCat', payload.serviceType);
      this._router.navigate(['/airtime-data']);
    } else {
      Session.set('BILLER_DATA', payload);
      this._router.navigate([`${trimStringToCase(payload['serviceBiller'], 'LOWER')}`]);
    }
  }

}
