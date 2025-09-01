import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductType {
  _id: string;
  ime: string;
}

@Injectable({ providedIn: 'root' })
export class ProductTypeService {
  private apiUrl = 'http://localhost:5000/api/types';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.apiUrl);
  }

  create(tip: { ime: string }): Observable<any> {
    return this.http.post(this.apiUrl, tip);
  }

  update(id: string, tip: { ime: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/id/${id}`, tip);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/id/${id}`);
  }

  getById(id: string): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.apiUrl}/id/${id}`);
  }
}
