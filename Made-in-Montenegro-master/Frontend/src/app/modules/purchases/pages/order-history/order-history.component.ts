import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../../../core/services/purchase.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  stavkeMap: { [kupovinaId: string]: any[] } = {};
  expandedOrderId: string | null = null;

  constructor(
    private purchaseService: PurchaseService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.purchaseService.getMojeKupovine().subscribe({
      next: (data) => {
        this.orders = data;
        for (let narudzba of data) {
          this.purchaseService.getStavkeKupovine(narudzba._id).subscribe({
            next: (stavke) => {
              this.stavkeMap[narudzba._id] = stavke;
            },
            error: () => {
              this.notification.show('Greška pri učitavanju stavki.', 'error');
            },
          });
        }
      },
      error: () => {
        this.notification.show('Greška pri učitavanju narudžbi.', 'error');
      },
    });
  }

  toggleOrder(id: string): void {
    this.expandedOrderId = this.expandedOrderId === id ? null : id;
  }

  getUkupnoZaNarudzbu(narudzbaId: string): number {
    const stavke = this.stavkeMap[narudzbaId];
    if (!stavke) return 0;

    return stavke.reduce(
      (s, st) => s + st.kolicina * (st.proizvod?.cijena || 0),
      0
    );
  }
}
