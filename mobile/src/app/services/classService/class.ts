import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClassService {

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

  // Obter dados de uma sala
  getClassById(id: number): Observable<any> {
    return this.api.get(`classes/${id}`);
  }

  // Regenerar o código para compartilhar
  regenerateCode(id: number): Observable<any> {
    return this.api.post(`classes/${id}/regenerate-code`, {});
  }
}


