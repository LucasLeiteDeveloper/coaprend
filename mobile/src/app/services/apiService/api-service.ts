import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // CORREÇÃO: Usar environment.apiUrl para a URL base, garantindo que a URL seja:
  // http://localhost:8000/api
//   private BASE_URL = environment.apiUrl; 
  private BASE_URL = "http://localhost:8000/api"; 


  constructor(private http: HttpClient) {}

  get(endpoint: string): Observable<any> {
    // Agora, a requisição será para: http://localhost:8000/api/classes/my
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
