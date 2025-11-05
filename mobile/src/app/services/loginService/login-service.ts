import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
  private apiUrl = environment.apiUrl; //gets the environment api url

  constructor(private router: Router, private http: HttpClient) { }

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

  async loginWithGoogle(): Promise<void>{
    try {
      //create the google provider
      const provider = new GoogleAuthProvider();

      //calls the login pop-up
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // gets the token
      const idToken = await user.getIdToken();

      //saves the token on localStorage
      localStorage.setItem("firebaseToken", idToken);
      console.log("Login com Google feito com sucesso!");

      //calls the sync route of backend
      await this.syncProfile(idToken);
    } catch(error){
      console.error("Erro ao logar com google: ", error);
      throw Error;
    }
  }

  //calls the backend to create the profile if it's the first login
  private async syncProfile(idToken: string): Promise<any> {
    //creates the header to API 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);

    //calls the protected route on backend
    return this.http.post(`${this.apiUrl}/auth/sync`, {}, { headers }).toPromise()
  }
}