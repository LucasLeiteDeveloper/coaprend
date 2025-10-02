import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // 👈 1. Para redirecionar
import { ApiService } from 'src/app/services/apiService/api-service'; // 👈 2. Serviço para comunicação com o Backend
import { RegisterService } from 'src/app/services/registerService/register-service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
 
  public errorMessage: string = '';
  public isLoading: boolean = false;

  // 4. Estrutura do formulário (IMPORTANTE: deve refletir o que o Laravel espera!)
  public form: any = {
    name: '',
    email: '',
    password: '',
    // O Laravel (com a regra 'confirmed') exige este campo para confirmar a senha
    password_confirmation: '', 
  };

  constructor(
    private registerService: RegisterService, 
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
    if (!this.registerService.isFormDataValid(this.form)) {
      this.errorMessage = "Por favor, preencha todos os campos e confirme sua senha corretamente.";
      return; 
    }

    this.isLoading = true; // Indica que a requisição está em andamento

    // **COMUNICAÇÃO COM A API (Backend)**
    this.apiService.postRegister(this.form).subscribe({
      next: (response: any) => {
        // SUCESSO: Login automático após o registro
        this.isLoading = false;
        console.log('Registro OK. Usuário criado e logado:', response.token);
        
        // Armazena o token para manter o usuário autenticado
        localStorage.setItem('auth_token', response.token); 
        
        // Redireciona para a home page do Coaprend
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        // ERRO: Pode ser falha de conexão ou erro de validação do Laravel (ex: e-mail já existe)
        this.isLoading = false;
        console.error('Falha na API durante o registro:', err);
        
        // Tenta exibir a mensagem de erro do backend
        this.errorMessage = err.error && err.error.message 
                          ? err.error.message 
                          : 'Erro no registro. Tente novamente mais tarde.';
      }
    });
  }
}