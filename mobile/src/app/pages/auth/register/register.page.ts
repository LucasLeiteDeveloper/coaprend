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
    dt_birthday: '', 
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
    
    console.table(this.form)
    if (!this.registerService.isFormDataValid(this.form)) {
      this.errorMessage = "Por favor, preencha todos os campos e confirme sua senha corretamente.";
      return; 
    }

    this.isLoading = true; // Indica que a requisição está em andamento
    
    this.registerService.register(this.form);
  }
}