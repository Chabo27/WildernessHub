import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
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
