import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {BillersService} from "../../shared/services/billers-service/billers.service";
import {Session} from "../../shared/utilities/session";
import {trimStringToCase} from "../../shared/utilities/helper";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(private _router: Router,
              private  _billerservices: BillersService) { }

  public state = {
    search: false,
    billerRequest: false,
    selectedCategory: '',
    fixed: true,
    loader: {
      billers: false,
    }
  };

  public payloads = {
    categories: [],
    billers: []
  };

  searchText: string;

  ngOnInit(){
    this.getBillers();
  }

  /**
   *
   * @param cat
   */
  public selectCat(cat: string): void {
    localStorage.setItem('selectedCat', cat);
    this._router.navigate(['/airtime-data']);
  }

  public showProvider() {
     if (this.searchText.length > 1) {
       this.state.fixed = false;
     } else {
       this.state.fixed = true;
     }
  }

  public selectBiller(payload): void {

    if (payload.serviceCategory === 'databundle' || payload.serviceCategory === 'airtime') {
      localStorage.setItem('selectedCat', payload.serviceType);
      this._router.navigate(['/airtime-data']);
    } else {
      Session.set('BILLER_DATA', payload);
      this._router.navigate([`${trimStringToCase(payload['serviceBiller'], 'LOWER')}`]);
    }
  }

  public getBillers(): void {
    this.state.loader.billers = true;
    this._billerservices.getAllBillers().subscribe(
      res => {
        console.log(res);
        this.state.loader.billers = false;
        this.state.search = true;
        this.payloads.billers = Object.keys(res.data).reduce((acc, a) => acc.concat(res.data[a]), []);
      }, err => {
        this.state.loader.billers = false;
        console.error(err);
      }
    );
  }
}
