import { Injectable } from '@angular/core';
import { Product } from './product.service';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';



export interface CartItem {
  proizvod: Product;
  kolicina: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  
  private readonly key = 'korpa';
  private cartSubject = new BehaviorSubject<number>(this.getTotalItems());

   constructor(private notification: NotificationService) {}

  cart$ = this.cartSubject.asObservable();

  getCart(): CartItem[] {
    const data = sessionStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

 addToCart(proizvod: Product): void {
  const korpa = this.getCart();
  const index = korpa.findIndex((item) => item.proizvod._id === proizvod._id);

  if (index >= 0) {
    // ✅ Provjera: ima li još dostupnih jedinica
    if (korpa[index].kolicina < proizvod.kolicina) {
      korpa[index].kolicina++;
    } else {
      // ❌ Već dodato koliko ima na stanju
      this.notification.show('Nema dovoljno proizvoda na stanju.', 'error');
      return;
    }
  } else {
    if (proizvod.kolicina > 0) {
      korpa.push({ proizvod, kolicina: 1 });
    } else {
      this.notification.show('Proizvod trenutno nije dostupan.', 'error');
      return;
    }
  }

  sessionStorage.setItem(this.key, JSON.stringify(korpa));
  this.cartSubject.next(this.getTotalItems());

  this.notification.show('Proizvod dodat u korpu.', 'success');
}


  getTotalItems(): number {
    return this.getCart().reduce((sum, item) => sum + item.kolicina, 0);
  }

  removeFromCart(proizvodId: string): void {
    const korpa = this.getCart().filter(
      (item) => item.proizvod._id !== proizvodId
    );
    sessionStorage.setItem(this.key, JSON.stringify(korpa));
    this.cartSubject.next(this.getTotalItems());
  }

  increaseQuantity(proizvodId: string): void {
    const korpa = this.getCart();
    const item = korpa.find((i) => i.proizvod._id === proizvodId);
    if (item) {
      if (item.kolicina < item.proizvod.kolicina) {
        item.kolicina++;
        sessionStorage.setItem(this.key, JSON.stringify(korpa));
        this.cartSubject.next(this.getTotalItems());
      } else {
        alert('Nema više na stanju.');
      }
    }
  }

  decreaseQuantity(proizvodId: string): void {
    const korpa = this.getCart();
    const item = korpa.find((i) => i.proizvod._id === proizvodId);
    if (item) {
      if (item.kolicina > 1) {
        item.kolicina--;
        sessionStorage.setItem(this.key, JSON.stringify(korpa));
        this.cartSubject.next(this.getTotalItems());
      } else {
        alert('Minimalna količina je 1.');
      }
    }
  }

  clearCart(): void {
    sessionStorage.removeItem(this.key);
    this.cartSubject.next(0);
  }

  getTotal(): number {
    const korpa = this.getCart();
    return korpa.reduce((total, item) => {
      return total + item.proizvod.cijena * item.kolicina;
    }, 0);
  }
}
