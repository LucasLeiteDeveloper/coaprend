import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private api: ApiService) {}

  getAll(): Observable<any> {
    return this.api.get('posts');
  }

  createFormData(payload: any, file?: File): Observable<any> {
    const form = new FormData();
    form.append('title', payload.title);
    form.append('type', payload.type);
    if (payload.content) form.append('content', payload.content);
    form.append('tag_color', payload.tag_color);
    if (payload.options) {
      payload.options.forEach((opt: string, i: number) => {
        form.append(`options[${i}]`, opt);
      });
    }
    if (file) form.append('image', file);
    return this.api.post('posts', form);
  }

  updateFormData(id: number, payload: any, file?: File): Observable<any> {
    const form = new FormData();
    if (payload.title) form.append('title', payload.title);
    if (payload.type) form.append('type', payload.type);
    if (payload.content) form.append('content', payload.content);
    if (payload.tag_color) form.append('tag_color', payload.tag_color);
    if (payload.options) {
      payload.options.forEach((opt: string, i: number) => {
        form.append(`options[${i}]`, opt);
      });
    }
    if (file) form.append('image', file);
    return this.api.put(`posts/${id}`, form);
  }

  delete(id: number): Observable<any> {
    return this.api.delete(`posts/${id}`);
  }
}
