import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';

const auth = getAuth();

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isFormDataValid(formData: any) {
    if(!formData.email || !formData.password){
      return false;
    }

    return true
  }
  // URL base da sua API Laravel. Lembre-se de mudar para o endereço correto!
  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private router: Router) { }

  // Função chamada pelo componente de login
  async login(formData: any): Promise<void> {
    const { email, password } = formData;

    //try login on firebase auth
    try {
      //login user
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;

      //get the new idToken
      const idToken = await user.getIdToken();

      //save the idToken
      localStorage.setItem("firebaseToken", idToken);
      this.router.navigate(['/home']);
    }catch(error){
      console.error("Error on login: ", error);
      throw error;
    }
  }
}