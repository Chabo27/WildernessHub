import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductTypeService } from '../../../core/services/product-type.service';

@Component({
  selector: 'app-type-form',
  templateUrl: './type-form.component.html',
  styleUrls: ['./type-form.component.scss']
})
export class TypeFormComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private typeService: ProductTypeService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      ime: ['', Validators.required]
    });

    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.editMode = !!this.id;

    if (this.editMode) {
      this.typeService.getById(this.id).subscribe(tip => {
        this.form.patchValue({ ime: tip.ime });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value;

    const request = this.editMode
      ? this.typeService.update(this.id, data)
      : this.typeService.create(data);

    request.subscribe(() => {
      this.router.navigate(['/admin/tipovi']);
    });
  }

  otkazi(): void {
    this.router.navigate(['/admin/tipovi']);
  }
}
