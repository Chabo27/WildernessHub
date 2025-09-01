import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.component.html',
  styleUrls: ['./navbar2.component.scss'],
})
export class Navbar2Component {
  isLoggedIn: boolean = false;
  brojArtikala = 0;
  imeKorisnika: string = '';
  menuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;

      if (status) {
        this.authService.getLoggedUser().subscribe((user) => {
          this.imeKorisnika = user?.ime || '';
        });
      }
    });

    this.cartService.cart$.subscribe((broj) => {
      this.brojArtikala = broj;
    });
  }

  logout(): void {
    this.authService.logout();
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
