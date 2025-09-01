import { ProductListComponent } from './../products/pages/product-list/product-list.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProducerService, Producer } from '../../core/services/producer.service';
import { ProductService, Product } from '../../core/services/product.service';

@Component({
  selector: 'app-manufacturer-details',
  templateUrl: './manufacturer-details.component.html',
  styleUrls: ['./manufacturer-details.component.scss'],
})
export class ManufacturerDetailsComponent implements OnInit {
  producer?: Producer;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private producerService: ProducerService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.producerService.getById(id).subscribe(p => this.producer = p);
      this.productService.getByManufacturer(id).subscribe(data => this.products = data);
    }
  }
}
