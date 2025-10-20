import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = "localhost:8000";

  constructor(private http: HttpClient) {}

  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${endpoint}`);
  }

  post(endpoint: string, data: any): Observable<any> {
    if (data instanceof FormData) {
      return this.http.post(`${this.BASE_URL}/${endpoint}`, data);
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.BASE_URL}/${endpoint}`, data, { headers });
  }

  put(endpoint: string, data: any): Observable<any> {
    if (data instanceof FormData) {
      return this.http.put(`${this.BASE_URL}/${endpoint}`, data);
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.BASE_URL}/${endpoint}`, data, { headers });
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${endpoint}`);
  }

  postRegister(formData: any): Observable<any> {
    return this.post('register', formData);
  }

  postLogin(formData: any): Observable<any> {
    return this.post('login', formData);
  }
}
