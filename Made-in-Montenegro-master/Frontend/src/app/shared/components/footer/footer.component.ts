import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  subscribeNewsletter() {
    // logika za slanje emaila ili poruka o uspješnoj prijavi
    console.log('Prijava na newsletter izvršena.');
  }
}
