import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClassService {

  private CURRENT_CLASS_KEY = 'CURRENT_USER_CLASS';

  constructor(private api: ApiService) {}

  // -------------------------------------------------------------
  // 🟢 Criar sala
  // -------------------------------------------------------------
  createClass(payload: any): Observable<any> {
    return this.api.post('classes', payload);
  }

  // -------------------------------------------------------------
  // 🔵 Todas as salas do usuário
  // -------------------------------------------------------------
  getMyClasses(): Observable<any> {
    return this.api.get('classes/my');
  }

  // -------------------------------------------------------------
  // 🟣 Entrar via código
  // -------------------------------------------------------------
joinClass(code: string): Observable<any> {
    // A API deve retornar o objeto da sala que o usuário acabou de entrar.
    // TODO: Plugar API real
    return this.api.post('classes/join', { code });
  }

  // -------------------------------------------------------------
  // 🟥 Sair da sala
  // -------------------------------------------------------------
  leaveClass(id: number): Observable<any> {
    return this.api.delete(`classes/${id}/leave`);
  }

  // -------------------------------------------------------------
  // 🔵 Obter dados completos de uma sala
  // -------------------------------------------------------------
  getClassById(id: number): Observable<any> {
    return this.api.get(`classes/${id}`);
  }

  // -------------------------------------------------------------
  // 🟡 Regenerar código
  // -------------------------------------------------------------
  regenerateCode(id: number): Observable<any> {
    return this.api.post(`classes/${id}/regenerate-code`, {});
  }

  // -------------------------------------------------------------
  // 🟢 Atualizar nome da sala
  // -------------------------------------------------------------
  updateClassName(id: number, name: string): Observable<any> {
    return this.api.put(`classes/${id}/name`, { name });
  }

  // -------------------------------------------------------------
  // 🟣 Atualizar foto da sala
  // -------------------------------------------------------------
  updateClassImage(id: number, imageBase64: string): Observable<any> {
    return this.api.put(`classes/${id}/image`, { image: imageBase64 });
  }

  // -------------------------------------------------------------
  // 🟥 Excluir sala
  // -------------------------------------------------------------
  deleteClass(id: number): Observable<any> {
    return this.api.delete(`classes/${id}`);
  }

  // -------------------------------------------------------------
  // 🔵 Definir sala atual do usuário
  // -------------------------------------------------------------
  setCurrentClass(id: number): Observable<any> {
    return this.api.post(`classes/${id}/set-current`, {});
  }

  // -------------------------------------------------------------
  // 🔵 Buscar sala atual
  // -------------------------------------------------------------
  getCurrentUserClass(): Observable<any> {
    return this.api.get('classes/current');
  }

  // -------------------------------------------------------------
  // 💾 LocalStorage – controle opcional
  // -------------------------------------------------------------
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
