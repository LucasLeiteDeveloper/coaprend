import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; // 👈 IMPORTANTE: Para redirecionar
import { ApiService } from 'src/app/services/apiService/api-service';
import { AuthService } from 'src/app/services/authService/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  userData = {
    email: '',
    password: ''
  }

  // Mensagem de erro padrão
  public errorMessage: string = ''; 
  
  public isLoading: boolean = false; // 👈 Bom para desativar o botão durante a requisição

  constructor(
    private authService: AuthService, // Renomeado para seguir convenção
    private apiService: ApiService,     // Renomeado para seguir convenção
    private router: Router              // Injeta o Router
  ) {}

  ngOnInit() {}

  // Ajuste: A função deve ser do tipo `void` e não deve retornar String.
  submitForm(): void {
    // Limpa a mensagem de erro anterior
    this.errorMessage = '';
    
    if (!this.loginForm.valid) {
      this.errorMessage = "Por favor, preencha todos os campos corretamente.";
      return; // Para a execução se os dados locais forem inválidos
    }

    this.isLoading = true; // Inicia o carregamento

    this.authService.login(this.userData);
  }

  // enter with Google service
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