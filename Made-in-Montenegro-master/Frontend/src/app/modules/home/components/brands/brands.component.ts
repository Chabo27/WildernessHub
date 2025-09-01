import { Component, OnInit } from '@angular/core';
import { Producer, ProducerService } from '../../../../core/services/producer.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {
  producers: Producer[] = [];
  selectedProducer?: Producer;

  constructor(private producerService: ProducerService) {}

  ngOnInit(): void {
    this.producerService.getAll().subscribe({
      next: data => this.producers = data,
      error: err => console.error('Greška pri dohvatu proizvođača', err)
    });
  }

  openDetails(producer: Producer): void {
    this.selectedProducer = producer;
  }

  closeDetails(): void {
    this.selectedProducer = undefined;
  }
}
