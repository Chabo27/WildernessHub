import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppNotification, NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  notification: AppNotification | null = null;
  globalMessage = '';

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['uspjesnaPrijava'] === 'true') {
        this.globalMessage = 'Uspješno ste se prijavili.';
        setTimeout(() => {
          this.globalMessage = '';
        }, 3000);
      }

      if (params['uspjesnaOdjava'] === 'true') {
        this.globalMessage = 'Uspješno ste se odjavili.';
        setTimeout(() => {
          this.globalMessage = '';
        }, 3000);
      }
    });

    this.notificationService.message$.subscribe(msg => {
    this.notification = msg;
    setTimeout(() => this.notification = null, 3000);
  });
  }
}
