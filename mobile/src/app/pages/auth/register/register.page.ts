import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; // 👈 1. Para redirecionar
import { ApiService } from 'src/app/services/apiService/api-service'; // 👈 2. Serviço para comunicação com o Backend
import { AuthService } from 'src/app/services/authService/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  //form object to valid data received
  @ViewChild('registerForm') registerForm!: NgForm;

  //object with the real userData
  userData = {
    name: '',
    email: '',
    password: '',
    dt_birthday: ''
  }
 
  public errorMessage: string = '';
  public isLoading: boolean = false;

  constructor(
    private authService: AuthService, 
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {}

  // 5. Função de envio do formulário
  submitForm(): void {
    this.errorMessage = '';
    
    // **VALIDAÇÃO LOCAL (Frontend)**
    // Você deve implementar uma função isRegisterDataValid no seu LoginService
    // que checa se as senhas são iguais, se todos os campos estão preenchidos, etc.
    
    if (!this.registerForm.valid) {
      this.errorMessage = "Por favor, preencha todos os campos e confirme sua senha corretamente.";
      return; 
    }

    this.isLoading = true; // Indica que a requisição está em andamento

    this.authService.register(this.userData);
  }

  async googleLogin(){
    try {
      this.isLoading = true;
      await this.authService.loginWithGoogle();

      //success, go to home
      this.router.navigate(['/home']);
    } catch(error){
      this.errorMessage = "Falha no login com Google. Tente novamente";
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}