import { Component, OnInit } from '@angular/core';
import {
  ProducerService,
  Producer,
} from '../../core/services/producer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producers',
  templateUrl: './producers.component.html',
  styleUrls: ['./producers.component.scss'],
})
export class ProducersComponent implements OnInit {
  producers: Producer[] = [];

  constructor(
    private producerService: ProducerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ucitajProizvodjace();
  }

  ucitajProizvodjace(): void {
    this.producerService.getAll().subscribe({
      next: (data) => (this.producers = data),
      error: (err) =>
        console.error('Greška prilikom učitavanja proizvođača', err),
    });
  }

  obrisi(id: string): void {
    if (confirm('Da li ste sigurni da želite da obrišete proizvođača?')) {
      this.producerService.deleteById(id).subscribe({
        next: () => {
          this.producers = this.producers.filter((p) => p._id !== id);
        },
        error: (err) => {
          alert(err.error?.poruka || 'Greška prilikom brisanja proizvođača.');
        },
      });
    }
  }

  dodaj(): void {
    this.router.navigate(['/admin/proizvodjaci/dodajNovogProizvodjaca']);
  }

  izmijeni(id: string): void {
    this.router.navigate([
      '/admin/proizvodjaci/izmijeniPostojecegProizvodjaca',
      id,
    ]);
  }
}
