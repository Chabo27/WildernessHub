import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  user: any;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe({
      next: (data) => (this.user = data),
      error: () => console.error('Greška pri dohvatanju korisnika'),
    });
  }

  azuriraj(): void {
    console.log('Novi podaci:', this.form.value);
    // Pozovi backend ako implementiraš ažuriranje
  }

  idiNaNarudzbine(): void {
    this.router.navigate(['/moje-narudzbe']);
  }
}
