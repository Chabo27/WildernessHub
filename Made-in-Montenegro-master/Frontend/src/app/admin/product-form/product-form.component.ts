import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import {
  ProducerService,
  Producer,
} from '../../core/services/producer.service';
import {
  ProductTypeService,
  ProductType,
} from '../../core/services/product-type.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  id!: string;
  selectedFile!: File;
  proizvodjaci: Producer[] = [];
  tipovi: ProductType[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private producerService: ProducerService,
    private productTypeService: ProductTypeService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      ime: ['', Validators.required],
      opis: [''],
      cijena: [null, [Validators.required, Validators.min(0.01)]],
      kolicina: [null, [Validators.required, Validators.min(0)]],
      proizvodjac: ['', Validators.required],
      tip: ['', Validators.required],
      slika: [''],
    });

    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.editMode = !!this.id;

    this.ucitajProizvodjace();
    this.ucitajTipove();

    if (this.editMode) {
      this.productService.getById(this.id).subscribe((p) => {
        this.form.patchValue({
          ime: p.ime,
          opis: p.opis,
          cijena: p.cijena,
          kolicina: p.kolicina,
          proizvodjac: p.proizvodjac?._id,
          tip: p.tip?._id,
          slika: p.slika,
        });
      });
    }
  }

  ucitajProizvodjace(): void {
    this.producerService.getAll().subscribe((data: Producer[]) => {
      this.proizvodjaci = data;
    });
  }

  ucitajTipove(): void {
    this.productTypeService.getAll().subscribe((data) => (this.tipovi = data));
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    const f = this.form.value;
    formData.append('ime', f.ime);
    formData.append('opis', f.opis);
    formData.append('cijena', String(f.cijena));
    formData.append('kolicina', String(f.kolicina));
    formData.append('proizvodjac', f.proizvodjac);
    formData.append('tip', f.tip);
    if (this.selectedFile) {
      formData.append('slika', this.selectedFile);
    } else if (this.editMode) {
      formData.append('slika', f.slika);
    }

    const request = this.editMode
      ? this.productService.update(this.id, formData)
      : this.productService.create(formData);

    request.subscribe(() => {
      alert(this.editMode ? 'Proizvod ažuriran.' : 'Proizvod dodat.');
      this.router.navigate(['/admin/proizvodi']);
    });
  }

  otkazi(): void {
    this.router.navigate(['/admin/proizvodi']);
  }
}
