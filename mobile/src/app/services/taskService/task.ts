import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private api: ApiService) {}

  // Buscar todas as tarefas
  getAll(): Observable<any> {
    return this.api.get('tasks');
  }

  // Buscar tarefas dentro de um intervalo de datas (SEMANA)
  getTasksByDateRange(start: string, end: string): Observable<any> {
    return this.api.get(`tasks/date-range?start=${start}&end=${end}`);
  }

  // Criar tarefa com anexos
  createFormData(payload: any, files: File[]): Observable<any> {
    const form = new FormData();

    form.append('titulo', payload.title);
    form.append('descricao', payload.description);
    form.append('data_limite', payload.deadline);

    if (payload.room_id) {
      form.append('sala_id', payload.room_id);
    }

    // Tags
    if (payload.options && payload.options.length > 0) {
      payload.options.forEach((tag: string, index: number) => {
        form.append(`tags[${index}]`, tag);
      });
    }

    // Anexos múltiplos
    if (files && files.length > 0) {
      files.forEach((file) => {
        form.append('anexos[]', file);
      });
    }

    return this.api.post('tasks', form);
  }

  search(text: string) {
  return this.api.get(`posts/search?text=${text}`);
}

  // Atualizar tarefa
  updateFormData(id: number, payload: any, files?: File[]): Observable<any> {
    const form = new FormData();

    if (payload.title) form.append('titulo', payload.title);
    if (payload.description) form.append('descricao', payload.description);
    if (payload.deadline) form.append('data_limite', payload.deadline);
    if (payload.room_id) form.append('sala_id', payload.room_id);

    if (payload.options) {
      payload.options.forEach((tag: string, index: number) => {
        form.append(`tags[${index}]`, tag);
      });
    }

    if (files && files.length > 0) {
      files.forEach((file) => {
        form.append('anexos[]', file);
      });
    }

    return this.api.put(`tasks/${id}`, form);
  }

  // Excluir tarefa
  delete(id: number): Observable<any> {
    return this.api.delete(`tasks/${id}`);
  }
}
