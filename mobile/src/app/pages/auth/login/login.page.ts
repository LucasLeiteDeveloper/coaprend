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

    // 1. O ApiService deve retornar um Observable que usamos aqui com o .subscribe()
    this.apiService.postLogin(this.form).subscribe({
      next: (response: any) => {
        // 2. SUCCESSO: Se o Laravel retornar 200 (OK)
        this.isLoading = false;
        console.log('Login OK. Token recebido:', response.token);
        
        // 3. Salva o token e/ou dados do usuário (EXEMPLO: No localStorage)
        localStorage.setItem('auth_token', response.token); 
        
        // 4. Redireciona o usuário (ex: para a página inicial do Coaprend)
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        // 5. ERRO: Se o Laravel retornar 401 (Unauthorized) ou outro erro
        this.isLoading = false;
        console.error('Falha na API:', err);
        
        // Exibe a mensagem de erro que vem do backend (Laravel)
        this.errorMessage = err.error && err.error.message 
                          ? err.error.message 
                          : 'Erro desconhecido ao tentar logar.';
      }
    });
  }
}