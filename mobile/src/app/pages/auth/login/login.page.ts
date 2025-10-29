import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // 👈 IMPORTANTE: Para redirecionar
import { ApiService } from 'src/app/services/apiService/api-service';
import { LoginService } from 'src/app/services/loginService/login-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  // Mensagem de erro padrão
  public errorMessage: string = ''; 
  public form: any = {
    email: '',
    password: '',
  };
  public isLoading: boolean = false; // 👈 Bom para desativar o botão durante a requisição

  constructor(
    private loginService: LoginService, // Renomeado para seguir convenção
    private apiService: ApiService,     // Renomeado para seguir convenção
    private router: Router              // Injeta o Router
  ) {}

  ngOnInit() {}

  // Ajuste: A função deve ser do tipo `void` e não deve retornar String.
  submitForm(): void {
    // Limpa a mensagem de erro anterior
    this.errorMessage = '';
    
    if (!this.loginService.isFormDataValid(this.form)) {
      this.errorMessage = "Por favor, preencha todos os campos corretamente.";
      return; // Para a execução se os dados locais forem inválidos
    }

    this.isLoading = true; // Inicia o carregamento

    this.loginService.login(this.form)
  }
}