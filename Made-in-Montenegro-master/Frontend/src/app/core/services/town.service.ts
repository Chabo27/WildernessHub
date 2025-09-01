import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Town {
  _id: string;
  ime: string; 
}

@Injectable({
  providedIn: 'root'
})
export class TownService {
  private apiUrl = 'http://localhost:5000/api/towns';

  constructor(private http: HttpClient) {}

  getTowns(): Observable<Town[]> {
    return this.http.get<Town[]>(this.apiUrl);
  }
}
