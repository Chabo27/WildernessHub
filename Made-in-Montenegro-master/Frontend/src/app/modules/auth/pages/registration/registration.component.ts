import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { TownService, Town } from '../../../../core/services/town.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  errorMessage = '';
  towns: Town[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private townService: TownService
  ) {
    this.registrationForm = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresa: ['', Validators.required],
      town: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.townService.getTowns().subscribe({
      next: (data) => {
        this.towns = data;
      },
      error: () => {
        console.error('Neuspješno učitavanje gradova');
      }
    });
  }

  get ime() { return this.registrationForm.get('ime')!; }
  get prezime() { return this.registrationForm.get('prezime')!; }
  get email() { return this.registrationForm.get('email')!; }
  get adresa() { return this.registrationForm.get('adresa')!; }
  get town() { return this.registrationForm.get('town')!; }
  get password() { return this.registrationForm.get('password')!; }
  get confirmPassword() { return this.registrationForm.get('confirmPassword')!; }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Molimo popunite sva obavezna polja.';
      return;
    }

    const {
      ime,
      prezime,
      email,
      adresa,
      town,
      password,
      confirmPassword
    } = this.registrationForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Lozinke se ne poklapaju.';
      return;
    }

    const korisnik = { ime, prezime, email, adresa, grad: town, password };

    this.authService.register(korisnik).subscribe({
      next: () => {
        this.router.navigate(['/auth/prijava'], {
        queryParams: { registrovan: 'true' }
});
      },
      error: (err) => {
        this.errorMessage = err.error.poruka || 'Registracija nije uspjela. Pokušaj ponovo.';
      }
    });
  }
}
