import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-kartica-placanje',
  templateUrl: './kartica-placanje.component.html',
  styleUrls: ['./kartica-placanje.component.scss'],
})
export class KarticaPlacanjeComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NotificationService,
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      ime: ['', Validators.required],
      brojKartice: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      datum: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
          this.datumUBuducnostiValidator,
        ],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  ngOnInit(): void {
    const korpa = this.cartService.getCart();
    if (!korpa || korpa.length === 0) {
      this.notification.show(
        'Korpa je prazna. Niste započeli kupovinu.',
        'error'
      );
      this.router.navigate(['/']);
    }
  }

  odustani(): void {
    this.router.navigate(['/']);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.notification.show('Unesite ispravne podatke.', 'error');
      return;
    }

    this.loading = true;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    try {
      // 1. Kreiraj kupovinu
      const kupovinaRes: any = await this.http
        .post(
          'http://localhost:5000/api/purchases',
          { nacinPlacanja: 'kartica' },
          { headers }
        )
        .toPromise();

      const kupovinaId = kupovinaRes.kupovina._id;

      // 2. Dodaj stavke
      const korpa = this.cartService.getCart();
      for (const item of korpa) {
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

      // 3. Očisti korpu, prikaži uspjeh, idi na potvrdu
      this.cartService.clearCart();
      this.notification.show('Plaćanje je uspješno izvršeno!', 'success');

      this.router.navigate(['/potvrda'], {
        state: {
          stavke: korpa,
          nacinPlacanja: 'karticom',
          datum: new Date(),
          ukupno: korpa.reduce(
            (sum, item) => sum + item.proizvod.cijena * item.kolicina,
            0
          ),
          kupovinaId,
        },
      });
    } catch (err) {
      console.error(err);
      this.notification.show('Greška prilikom plaćanja.', 'error');
    } finally {
      setTimeout(() => {
        this.loading = false;
      }, 3000); 
    }
  }

  datumUBuducnostiValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const [monthStr, yearStr] = value.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt('20' + yearStr, 10);

    const today = new Date();
    const expiry = new Date(year, month);

    return expiry > today ? null : { expired: true };
  }
}
