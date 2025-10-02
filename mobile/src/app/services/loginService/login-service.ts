import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isFormDataValid(obj: Object) {
    return true
  }
  // URL base da sua API Laravel. Lembre-se de mudar para o endereço correto!
  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) { }

  // Função chamada pelo componente de login
  login(email: string, senha: string) {
    // 1. Cria o objeto JSON com os dados de login
    const dadosLogin = { 
      email: email, 
      password: senha 
    };

    // 2. Define os headers (cabeçalhos) para informar que o corpo é JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // 3. Envia a requisição POST para o endpoint '/login' do Laravel
    // O '.pipe(catchError(...))' é uma boa prática para lidar com erros na requisição.
    return this.http.post(`${this.apiUrl}/login`, dadosLogin, { headers });
  }
}