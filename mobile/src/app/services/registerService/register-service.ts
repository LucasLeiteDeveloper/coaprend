import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

//starts the auth
const auth = getAuth();

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8000/api'

  constructor(
    private router: Router,
    private http: HttpClient) { }

  /**
   * Verifica se os dados do formulário de registro são válidos
   * (Checagem local antes de enviar à API).
   *    * @param formData Objeto com os dados: { name, email, password, password_confirmation }
   * @returns true se os dados forem válidos, false caso contrário.
   */

  
  async register(formData: any): Promise<void>{
    const { email, password, name, dt_birthday } = formData;
    console.log(email)
    console.log(password)
    console.log(name)
    console.log(dt_birthday)
    //create an account on firebase
    try {
      // create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //get uid and idToken
      const uid = user.uid;
      const idToken = await user.getIdToken();

      //create account on API
      const accountData = {
        uid,
        name: name,
        email: email,
        dt_birthday: dt_birthday,
      }

      await this.http.post(`${this.apiUrl}/register`, accountData).toPromise();

      //save the token for session
      localStorage.setItem("firebaseToken", idToken);
      console.log("Cadastrado!")
    } catch(error) {
      console.error("Error on register: ", error);

      throw error; //reject the promise
    }
  }

  isFormDataValid(formData: any): boolean {
    // 1. Checagem de preenchimento
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
        // Log ou tratamento de erro mais específico pode ser adicionado aqui.
        return false;
    }

    // 2. Checagem de confirmação de senha
    if (formData.password !== formData.password_confirmation) {
        // As senhas não conferem.
        return false;
    }
    
    // 3. (Opcional) Você pode adicionar validação de formato de e-mail ou 
    // requisitos mínimos de senha aqui para feedback imediato ao usuário.

    return true; 
  }
}