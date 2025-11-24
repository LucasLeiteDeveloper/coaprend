import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClassService {

  private CURRENT_CLASS_KEY = 'CURRENT_USER_CLASS';

  constructor(private api: ApiService) {}

  // Criar sala
  createClass(payload: any): Observable<any> {
    return this.api.post('classes', payload);
  }

  // Todas as salas do usuário
  getMyClasses(): Observable<any> {
    return this.api.get('classes/my');
  }

  // Entrar via código
  joinClass(code: string): Observable<any> {
    return this.api.post('classes/join', { code });
  }

  // Sair da sala
  leaveClass(id: number): Observable<any> {
    return this.api.delete(`classes/${id}/leave`);
  }

  // Obter dados de uma sala específica
  getClassById(id: number): Observable<any> {
    return this.api.get(`classes/${id}`);
  }

  // Regenerar o código para compartilhar
  regenerateCode(id: number): Observable<any> {
    return this.api.post(`classes/${id}/regenerate-code`, {});
  }

  // -------------------------------------------------------------------------
  // 🔵 NOVO: Pegar sala atual do usuário (definida no backend)
  // -------------------------------------------------------------------------
  getCurrentUserClass(): Observable<any> {
    return this.api.get('classes/current'); 
    // rota padrão: GET /classes/current → retorna a sala atual do usuário
  }

  // -------------------------------------------------------------------------
  // 🔵 NOVO: Trocar sala ativa (backend)
  // -------------------------------------------------------------------------
  setCurrentClass(id: number): Observable<any> {
    return this.api.post(`classes/${id}/set-current`, {});
    // rota padrão: POST /classes/{id}/set-current
  }

  // -------------------------------------------------------------------------
  // 🔵 OPCIONAL: salvar sala ativa no localStorage
  // -------------------------------------------------------------------------
  saveLocalCurrentClass(classObj: any) {
    localStorage.setItem(this.CURRENT_CLASS_KEY, JSON.stringify(classObj));
  }

  getLocalCurrentClass(): any | null {
    const data = localStorage.getItem(this.CURRENT_CLASS_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearLocalCurrentClass() {
    localStorage.removeItem(this.CURRENT_CLASS_KEY);
  }
}
