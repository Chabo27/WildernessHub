import { Component, OnInit } from '@angular/core';
import {
  ProductService,
  Product,
} from '../../../../core/services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { debounce } from 'lodash';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = []; // čuva sve proizvode
  searchTerm: string = ''; // za unos pretrage

  prikaziFiltere: boolean = false;

  minCijena: number | null = null;
  maxCijena: number | null = null;

  selectedProizvodjaci: string[] = [];
  selectedTipovi: string[] = [];

  sviProizvodjaci: string[] = [];
  sviTipovi: string[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        console.log('Proizvodi:', data);
        this.products = data;
        this.allProducts = data;

        this.sviProizvodjaci = [
          ...new Set(
            data
              .map((p) => p.proizvodjac?.ime)
              .filter((ime): ime is string => !!ime)
          ),
        ];
        this.sviTipovi = [
          ...new Set(
            data.map((p) => p.tip?.ime).filter((ime): ime is string => !!ime)
          ),
        ];
      },
      error: (err) => {
        console.error('Greška pri dohvaćanju proizvoda:', err);
      },
    });
  }

filterProducts(): void {
  const term = this.searchTerm.trim().toLowerCase();

  this.products = this.allProducts.filter((proizvod) => {
    const matchesIme = proizvod.ime.toLowerCase().includes(term);

    const matchesProizvodjac =
      this.selectedProizvodjaci.length === 0 ||
      this.selectedProizvodjaci.includes(proizvod.proizvodjac?.ime ?? '');

    const matchesTip =
      this.selectedTipovi.length === 0 ||
      this.selectedTipovi.includes(proizvod.tip?.ime ?? '');

    const matchesCijena =
      this.maxCijena === null || proizvod.cijena <= this.maxCijena;

    return matchesIme && matchesProizvodjac && matchesTip && matchesCijena;
  });
}


  openDetails(productId: string): void {
    this.router.navigate(['/proizvodi', productId]);
  }

  dodajUKorpu(event: Event, proizvod: Product): void {
    event.stopPropagation();
    this.cartService.addToCart(proizvod);
   // this.notification.show('Proizvod dodat u korpu!');
  }

  jeDodatoMaksimum(proizvod: Product): boolean {
    const korpa = this.cartService.getCart();
    const stavka = korpa.find((item) => item.proizvod._id === proizvod._id);
    return stavka ? stavka.kolicina >= proizvod.kolicina : false;
  }

  onProizvodjacChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    if (checkbox.checked) {
      this.selectedProizvodjaci.push(value);
    } else {
      this.selectedProizvodjaci = this.selectedProizvodjaci.filter(
        (p) => p !== value
      );
    }
  }

  onTipChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    if (checkbox.checked) {
      this.selectedTipovi.push(value);
    } else {
      this.selectedTipovi = this.selectedTipovi.filter((t) => t !== value);
    }
  }

  primijeniFiltriranje(): void {
    this.filterProducts();
  }

  resetujFiltere(): void {
    this.selectedProizvodjaci = [];
    this.selectedTipovi = [];
    this.maxCijena = null;
    this.filterProducts();
  }
}
