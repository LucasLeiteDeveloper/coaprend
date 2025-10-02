import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; // 👈 Importa o Observable



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL base da sua API Laravel - Altere para o endereço de sua máquina ou servidor!
  private BASE_URL = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) { }
 // Função para envio de dados de REGISTRO
  postRegister(formData: any): Observable<any> {
    const url = `${this.BASE_URL}/register`;
    
    // Opcional, mas mantém o padrão
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Envia a requisição POST para o endpoint '/register'
    return this.http.post(url, formData, { headers });
  }
  // Função que envia a requisição POST para o endpoint de login do Laravel
  postLogin(formData: any): Observable<any> {
    // 1. Define o endpoint específico
    const url = `${this.BASE_URL}/login`;
    
    // 2. Define os headers (opcional, mas boa prática)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // 3. Retorna o Observable da requisição POST
    // O 'formData' já contém { email: '...', password: '...' }
    return this.http.post(url, formData, { headers });
  }

  // Você adicionaria aqui outros métodos (ex: postCadastro, getCursos, etc.)
}