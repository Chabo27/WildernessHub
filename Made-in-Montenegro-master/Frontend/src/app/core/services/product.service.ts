import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  _id: string;
  ime: string;
  proizvodjac: {
    _id: string;
    ime: string;
    opis?: string;
    logo?: string;
  };
  slika: string;
  opis?: string;
  cijena: number;
  tip?: {
    _id: string;
    ime: string;
  };
  kolicina: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/id/${id}`);
  }

  create(product: FormData): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  update(id: string, product: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/id/${id}`, product);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/id/${id}`);
  }

  getByManufacturer(manufacturerId: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `http://localhost:5000/api/products/by-manufacturer/${manufacturerId}`
    );
  }
}
