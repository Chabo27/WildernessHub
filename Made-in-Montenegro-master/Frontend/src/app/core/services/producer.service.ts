import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producer {
  _id: string;
  ime: string;
  opis?: string;
  logo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProducerService {
  private apiUrl = 'http://localhost:5000/api/manufacturers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Producer[]> {
    return this.http.get<Producer[]>(this.apiUrl);
  }

  deleteById(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/id/${id}`);
  }

  getById(id: string): Observable<Producer> {
    return this.http.get<Producer>(`${this.apiUrl}/id/${id}`);
  }

  create(producer: Producer): Observable<any> {
    return this.http.post(this.apiUrl, producer);
  }

  update(id: string, producer: Producer): Observable<any> {
    return this.http.put(`${this.apiUrl}/id/${id}`, producer);
  }

  
}
