import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminPurchaseService {
  private apiUrl = 'http://localhost:5000/api/purchases';

  constructor(private http: HttpClient) {}

  getAllPurchases(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
  }

  getItemsForPurchase(purchaseId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:5000/api/purchases/${purchaseId}/stavke`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
  }

  deletePurchase(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/purchases/id/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
  }
}
