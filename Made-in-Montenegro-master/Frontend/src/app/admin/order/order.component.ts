import { Component, OnInit } from '@angular/core';
import { AdminPurchaseService } from '../../core/services/admin-purchase.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  kupovine: any[] = [];
  stavkeMap: { [kupovinaId: string]: any[] } = {};
  expandedPurchaseId: string | null = null;
  pretraga: string = '';
  datumFilter: string = '';

  constructor(
    private adminService: AdminPurchaseService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminService.getAllPurchases().subscribe({
      next: (data) => {
        this.kupovine = data;
        for (let kupovina of data) {
          this.adminService.getItemsForPurchase(kupovina._id).subscribe({
            next: (stavke) => {
              console.log('Stavke za', kupovina._id, ':', stavke); // za debug
              this.stavkeMap[kupovina._id] = stavke;
            },
            error: () => {
              console.error(
                'Greška pri učitavanju stavki kupovine:',
                kupovina._id
              );
            },
          });
        }
      },
      error: () => {
        console.error('Greška pri učitavanju kupovina');
      },
    });
  }

  toggleStavke(id: string): void {
    this.expandedPurchaseId = this.expandedPurchaseId === id ? null : id;
  }

  getUkupno(kupovinaId: string): number {
    const stavke = this.stavkeMap[kupovinaId];
    if (!stavke) return 0;
    return stavke.reduce(
      (s, st) => s + st.kolicina * (st.proizvod?.cijena || 0),
      0
    );
  }

  getFiltriraneKupovine(): any[] {
    let filtrirane = this.kupovine;

    if (this.pretraga.trim()) {
      const query = this.pretraga.trim().toLowerCase();
      filtrirane = filtrirane.filter((k) =>
        (k.korisnik?.ime + ' ' + k.korisnik?.prezime)
          .toLowerCase()
          .includes(query)
      );
    }

    if (this.datumFilter) {
      filtrirane = filtrirane.filter((k) => {
        const datumKupovine = new Date(k.datum).toISOString().split('T')[0];
        return datumKupovine === this.datumFilter;
      });
    }

    return filtrirane;
  }

  obrisiKupovinu(id: string): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu porudžbinu?')) {
      this.adminService.deletePurchase(id).subscribe({
        next: () => {
          this.kupovine = this.kupovine.filter((k) => k._id !== id);
          delete this.stavkeMap[id];

          this.notification.show('Kupovina je uspješno obrisana.', 'success');
        },
        error: () => {
          alert('Greška pri brisanju porudžbine.');
        },
      });
    }
  }

  posaljiNaPotvrdu(narudzba: any): void {
    const stavke = this.stavkeMap[narudzba._id];

    if (!stavke || stavke.length === 0) {
      alert('Stavke nisu učitane.');
      return;
    }

    const ukupno = this.getUkupno(narudzba._id);

    this.router.navigate(['/potvrda'], {
      state: {
        kupovinaId: narudzba._id,
        stavke,
        nacinPlacanja: narudzba.nacinPlacanja,
        datum: narudzba.datum,
        ukupno,
      },
    });
  }
}
