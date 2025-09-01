import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // ako već koristiš AuthService za token

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiUrl = 'http://localhost:5000/api/purchases';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getMojeKupovine(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/myPurchases`, {
      headers: this.getAuthHeaders(),
    });
  }

  getStavkeKupovine(kupovinaId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${kupovinaId}/stavke`, {
      headers: this.getAuthHeaders(),
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }
}
