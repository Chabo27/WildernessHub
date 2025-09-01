import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../core/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        console.log('Dobijeni proizvodi:', data);
        // filtriraj ako neki proizvod nema validnog proizvođača
        this.products = data.filter((p) => p.proizvodjac && p.proizvodjac.ime);
      },
      error: () => alert('Greška pri učitavanju proizvoda.'),
    });
  }

  edit(id: string): void {
    this.router.navigate(['/admin/proizvodi/izmijeniPostojeciProizvod', id]);
  }

  delete(id: string): void {
    if (confirm('Da li ste sigurni da želite da obrišete proizvod?')) {
      this.productService.delete(id).subscribe(() => {
        this.products = this.products.filter((p) => p._id !== id);
      });
    }
  }

  add(): void {
    this.router.navigate(['/admin/proizvodi/dodajNoviProizvod']);
  }
}
