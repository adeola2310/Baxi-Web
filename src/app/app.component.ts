import { Component } from '@angular/core';
import {ConnectionService} from 'ng-connection-service';
import {NotificationPosition, NotificationService} from './shared/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'baxi-pay';
  isConnected = true;

  constructor(private connectionService: ConnectionService, private notificationService: NotificationService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.notificationService.showSuccess('You\'re now connected', 'Online', false, null, NotificationPosition.BOTTON_LEFT);
      } else {
        this.notificationService.showError('You\'re not connected to the internet', '', 'Offline', 10000, NotificationPosition.BOTTON_LEFT);
      }
    });
  }
}
