import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppNotification {
  poruka: string;
  tip: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new Subject<AppNotification>();
  message$ = this.messageSubject.asObservable();

  show(poruka: string, tip: 'success' | 'error' | 'info' = 'info'): void {
    this.messageSubject.next({ poruka, tip });
  }
}
