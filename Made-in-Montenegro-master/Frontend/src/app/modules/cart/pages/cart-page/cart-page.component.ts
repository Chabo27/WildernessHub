import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  korpa: CartItem[] = [];
  ukupno = 0;
  modalOtvoren = false;
  nacinPlacanja: string | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.korpa = this.cartService.getCart();
    this.ukupno = this.korpa.reduce(
      (sum, item) => sum + item.kolicina * item.proizvod.cijena,
      0
    );
  }

  obrisiStavku(id: string): void {
    this.cartService.removeFromCart(id);
    this.ngOnInit(); // ponovo učitaj
  }

  povecaj(id: string): void {
    this.cartService.increaseQuantity(id);
    this.ngOnInit();
  }

  smanji(id: string): void {
    this.cartService.decreaseQuantity(id);
    this.ngOnInit();
  }

  otvoriModal(): void {
    if (!this.korpa || this.korpa.length === 0) {
      this.notification.show('Korpa je prazna.', 'error');
      return;
    }
    this.authService.isLoggedIn().subscribe((ulogovan) => {
      if (!ulogovan) {
        setTimeout(() => {
          this.notification.show(
            'Morate biti prijavljeni da biste izvršili kupovinu',
            'error'
          );
        }, 0);
        console.log('Nije ulogovan – prikazujem poruku');

        return;
      }

      this.modalOtvoren = true;
    });
  }

  odustani() {
    this.modalOtvoren = false;
    this.router.navigate(['/']);
  }

  nastavi() {
    if (!this.korpa || this.korpa.length === 0) {
      this.notification.show('Korpa je prazna.', 'error');
      return;
    }

    if (!this.nacinPlacanja) {
      this.notification.show('Izaberite opciju za plaćanje', 'error');
      return;
    }

    if (this.nacinPlacanja === 'pouzećem') {
      this.zavrsiKupovinuPouzecem();
    }

    if (this.nacinPlacanja === 'karticom') {
      this.modalOtvoren = false;
      this.router.navigate(['/placanje-karticom']);
    }
  }

  async zavrsiKupovinuPouzecem(): Promise<void> {
    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
      });

      this.korpa = this.korpa.filter((item) => item.kolicina > 0);

      // 1. Kreiraj kupovinu
      const kupovinaRes: any = await this.http
        .post(
          'http://localhost:5000/api/purchases',
          { nacinPlacanja: 'pouzećem' },
          { headers }
        )
        .toPromise();

      const kupovinaId = kupovinaRes.kupovina._id;

      // 2. Dodaj stavke kupovine
      for (const item of this.korpa) {
        await this.http
          .post(
            'http://localhost:5000/api/purchase-items',
            {
              kupovina: kupovinaId,
              proizvod: item.proizvod._id,
              kolicina: item.kolicina,
              cijena: item.proizvod.cijena,
            },
            { headers }
          )
          .toPromise();
      }

      const ukupnoZaPotvrdu = this.cartService.getTotal(); // spremi prije brisanja
      // 3. Očisti korpu
      this.cartService.clearCart();

      // 4. Prikaži poruku i prikaži potvrdu
      this.notification.show('Kupovina je uspješno izvršena!', 'success');
      

      this.router.navigate(['/potvrda'], {
        state: {
          stavke: this.korpa,
          nacinPlacanja: 'pouzećem',
          datum: new Date(),
          ukupno: ukupnoZaPotvrdu,
          kupovinaId: kupovinaId,
        },
      });
    } catch (err) {
      console.error(err);
      this.notification.show('Greška prilikom obrade kupovine.', 'error');
    }
  }
}
