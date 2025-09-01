import { Component, OnInit } from '@angular/core';
import {
  ProductTypeService,
  ProductType,
} from '../../../core/services/product-type.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipovi',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss'],
})
export class TypesComponent implements OnInit {
  tipovi: ProductType[] = [];

  constructor(private service: ProductTypeService, private router: Router) {}

  ngOnInit(): void {
    this.ucitajTipove();
  }

  ucitajTipove(): void {
    this.service.getAll().subscribe((data) => (this.tipovi = data));
  }

  obrisi(id: string): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj tip?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.ucitajTipove();
        },
        error: (err) => {
          alert(err.error?.poruka || 'Greška pri brisanju tipa.');
        },
      });
    }
  }

  dodaj(): void {
    this.router.navigate(['/admin/tipovi/dodajNoviTip']);
  }

  izmijeni(id: string): void {
    this.router.navigate(['/admin/tipovi/izmijeniPostojeciTip', id]);
  }
}
