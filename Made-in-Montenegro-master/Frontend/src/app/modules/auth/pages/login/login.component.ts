import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Ako je korisnik već prijavljen
    if (this.authService.getToken()) {
      this.router.navigate(['/']);
    }

    // Provjera query parametara (npr. ?registered=true)
    this.route.queryParams.subscribe(params => {
      if (params['registrovan'] === 'true') {
        this.successMessage = 'Uspješno ste registrovani. Nastavite sa prijavom.';
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/'], {
          queryParams: { uspjesnaPrijava: 'true' }
          });
        },
        error: (err: any) => {
          this.errorMessage = 'Prijava nije uspjela. Provjerite podatke.';
        }
      });
    }
  }
}
