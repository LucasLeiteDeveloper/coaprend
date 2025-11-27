import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

//format that the dt_birthday is returned by firetore
export interface FirestoreTimestamp {
  _seconds: number,
  _nanoseconds: number,
}

export interface UserProfile {
  name: string,
  email: string,
  dt_birthday?: string | FirestoreTimestamp,
  bio?: string,
  username?: string,
  imgAccount?: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //the API URL, from environment, adding auth route
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  //gets the auth
  private auth = getAuth();

  //this will tell us if some user is authenticated
  private isAuthenticatedSubject = new BehaviorSubject<boolean | undefined>(false); //initialize with "false"
  //its a listener that others files can check
  public isAuthenticated$: Observable<boolean | undefined> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) { 
    //firebase's listener that check if the user logon, logout or if the token is expired
    onAuthStateChanged(this.auth, (user) => {
      if(user){ //if the user is logged in
        this.isAuthenticatedSubject.next(true);
      } else { // if isn't
        this.isAuthenticatedSubject.next(false);
      }
    })
  }

  //register a new user 
  async register(formData: any): Promise<void>{
    const { email, password, name, dt_birthday, username } = formData;
    
    //create an account on firebase
    try {
      // create a new user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      //get uid and idToken
      const uid = user.uid;
      const idToken = await user.getIdToken();

      //create account on API
      const accountData = {
        uid,
        name: name,
        email: email,
        username: username,
        dt_birthday: dt_birthday,
      }

      await this.http.post(`${this.apiUrl}/register`, accountData).toPromise();

      //save the token for session
      localStorage.setItem("firebaseToken", idToken);
      
      this.router.navigate(['/class/0/posts']);
    } catch(error: any) {
      // verify the type of error
      if(error.error && error.error.error) {
        this.showToast(error.error.error);
      } else {
        this.showToast("Erro ao cadastrar usuário!");
      }

      this.showToast("Erro ao cadastrar usuário!")
      console.error("Error on register: ", error);

      throw error; //reject the promise
    }
  }

  //log in into an user account
  async login(formData: any): Promise<void> {
    const { email, password } = formData;

    //try login on firebase auth
    try {
      //login user
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      const user = userCredential.user;

      //get the new idToken
      const idToken = await user.getIdToken();

      //save the idToken
      localStorage.setItem("firebaseToken", idToken);
      this.router.navigate(['/class/0/posts']);
    }catch(error){
      this.showToast("Erro ao entrar na conta")
      console.error("Error on login: ", error);
      throw error;
    }
  }

  //enter in the profile with google
  async loginWithGoogle(): Promise<void>{
    try {
        //create the google provider
        const provider = new GoogleAuthProvider();
  
        //calls the login pop-up
        const userCredential = await signInWithPopup(this.auth, provider);
        const user = userCredential.user;
  
        // gets the token
        const idToken = await user.getIdToken();
  
        //saves the token on localStorage
        localStorage.setItem("firebaseToken", idToken);
        console.log("Login com Google feito com sucesso!");
  
        //calls the sync route of backend
        await this.syncProfile(idToken);
        this.router.navigate(['class/0/posts'])
      } catch(error){
        this.showToast("Erro ao entrar com o Google!");
        console.error("Erro ao logar com google: ", error);
        throw Error;
      }
  }
  //sync the profile with the profile created in firestore
  private async syncProfile(idToken: string): Promise<any> {
    //creates the header to API 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);

    //calls the protected route on backend
    return this.http.post(`${this.apiUrl}/sync`, {}, { headers }).toPromise()
  }

  //send e-mail in case of 'forgot-password'
  async sendResetEmail(email: string): Promise<void>{
    try {
      //firebase works to us
      await sendPasswordResetEmail(this.auth, email);
    }catch(error) {
      this.showToast("Erro ao entrar na conta!");
      console.error("Erro ao enviar e-mail de redefinição: ", error);
      throw error;
    }
  }

  async updateProfileData(updates: Partial<UserProfile>): Promise<void>{
    try{
      // gets the idToken and check if is valid
      const idToken = localStorage.getItem("firebaseToken");
      if(!idToken) throw new Error("Usuário não autenticado!");

      //set the header
      const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);

      // http://localhost:8000/api/auth/profile
      const url = `${this.apiUrl}/profile`;

      await this.http.patch(url, updates, { headers }).toPromise();
      this.showToast("Perfil atualizado!");
    } catch(error: any){
      if(error.error.error){
        this.showToast(error.error.error);
      } else {
        this.showToast("Erro ao atualizar perfil!");
      }
      console.error("Erro ao atualizar perfil: ", error);
      throw error;
    }
  }

  //clean all session data and let in login
  async logout(){
    await this.auth.signOut();
    localStorage.removeItem('firebaseToken');

    //return to login page
    this.router.navigate(['/login']);
  }

  //delete the account
  async deleteAccount(): Promise<void>{
    try {
      //get the idToken of the logged user
      const idToken = localStorage.getItem("firebaseToken");

      //if doesn't exist any idToken
      if(!idToken) throw new Error("Usuário não autenticado!");

      //create the auth header
      const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);

      //calls the delete route
      await this.http.delete(`${this.apiUrl}/user/me`, { headers }).toPromise();

      // if it's alright, clean the frontend
      this.logout();
    } catch(error){
      this.showToast("Erro ao deletar usuário")
      console.error("Erro a excluir conta: ", error);
      throw error;
    }
  }

  //get the user profile data
  async getProfileData(): Promise<UserProfile> {
    try {
      const idToken = localStorage.getItem("firebaseToken");

      if(!idToken) throw new Error("Usuário não autenticado!");

      //create the header of authorization
      const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);
      //prepares the call to /api/auth/profile
      const url = `${this.apiUrl}/profile`;

      const profile = await this.http.get<UserProfile>(url, { headers }).toPromise();
      return profile as UserProfile;
    }catch(error){
      console.error("Erro ao buscar dados do perfil: ", error);
      throw error;
    }
  }

  //show the error toast
  async showToast(msg: string){
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'top'
    })

    await toast.present();
  }
}
