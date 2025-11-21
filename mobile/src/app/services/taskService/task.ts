import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private api: ApiService) {}

  getAll(): Observable<any> {
    return this.api.get('tasks');
  }

  createFormData(payload: any, files: File[]): Observable<any> {
    const form = new FormData();

    // Mapeamento correto para o backend
    form.append('titulo', payload.title);
    form.append('descricao', payload.description);
    form.append('data_limite', payload.deadline);

    if (payload.room_id) {
      form.append('sala_id', payload.room_id);
    }

    // Tags (opções)
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

  delete(id: number): Observable<any> {
    return this.api.delete(`tasks/${id}`);
  }
}
