import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcastNotificationService {

    constructor() {
    }

    private dataChange = new Subject<any>();

    dataChanged$ = this.dataChange.asObservable();
  
    public login (data : any) {
      this.dataChange.next(data);
    }
}
