import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private api: ApiService) {}

  public isFormDataValid(obj: Object) {
    return true
  }

  login(email: string, senha: string) {
    const dadosLogin = { 
      email: email, 
      password: senha 
    };
    return this.api.post('posts', dadosLogin);
  }
}