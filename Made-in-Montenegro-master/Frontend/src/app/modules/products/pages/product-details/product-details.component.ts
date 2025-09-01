import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ProductService,
  Product,
} from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  proizvod: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe((data) => {
        this.proizvod = data;
      });
    }
  }

  dodajUKorpu(): void {
    if (this.proizvod) {
      this.cartService.addToCart(this.proizvod);
     // this.notification.show('Proizvod dodat u korpu!');
    }
  }

  jeDodatoMaksimum(proizvod: Product): boolean {
    const korpa = this.cartService.getCart();
    const stavka = korpa.find((item) => item.proizvod._id === proizvod._id);
    return stavka ? stavka.kolicina >= proizvod.kolicina : false;
  }
}
