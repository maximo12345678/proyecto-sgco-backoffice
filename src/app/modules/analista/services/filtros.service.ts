import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class FiltrosService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get('../../../assets/Filtros.json');
  }
}