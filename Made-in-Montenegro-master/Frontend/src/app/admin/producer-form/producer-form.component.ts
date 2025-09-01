import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProducerService, Producer } from '../../core/services/producer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-producer-form',
  templateUrl: './producer-form.component.html',
  styleUrls: ['./producer-form.component.scss'],
})
export class ProducerFormComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private producerService: ProducerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      ime: ['', Validators.required],
      opis: [''],
      logo: [''],
    });

    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.editMode = !!this.id;

    if (this.editMode) {
      this.producerService.getById(this.id).subscribe({
        next: (p) => this.form.patchValue(p),
        error: () => alert('Greška pri učitavanju proizvođača.'),
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value;

    if (this.editMode) {
      this.producerService.update(this.id, data).subscribe(() => {
        alert('Proizvođač je ažuriran.');
        this.router.navigate(['/admin/proizvodjaci']);
      });
    } else {
      this.producerService.create(data).subscribe(() => {
        alert('Proizvođač je dodat.');
        this.router.navigate(['/admin/proizvodjaci']);
      });
    }
  }

  otkazi(): void {
    this.router.navigate(['/admin/proizvodjaci']);
  }
}
