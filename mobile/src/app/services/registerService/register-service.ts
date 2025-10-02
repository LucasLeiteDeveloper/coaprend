import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor() { }

  /**
   * Verifica se os dados do formulário de registro são válidos
   * (Checagem local antes de enviar à API).
   *    * @param formData Objeto com os dados: { name, email, password, password_confirmation }
   * @returns true se os dados forem válidos, false caso contrário.
   */
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

  // Outras funções relacionadas a fluxos de registro (ex: validar nome de usuário) viriam aqui.
}