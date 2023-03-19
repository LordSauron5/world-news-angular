import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService, Command } from '../notifications.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  messages: Observable<Command[]>

  constructor(private notificationsService: NotificationsService) {
    this.messages = this.notificationsService.messagesOutput;

    // setInterval(() => {
    //   this.notificationsService.addError('IT IS not WORKING!!');
    // }, 2000);
   }

  ngOnInit(): void {
  }

  clearMessage(id: number) {
    this.notificationsService.clearMessage(id);
  }

}
