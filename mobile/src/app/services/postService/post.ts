import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private api: ApiService) {}

  /**
   * Obtém todas as postagens da API e faz o parse dos campos JSON (items, options)
   */
  getAll(): Observable<any> {
    return this.api.get('posts').pipe(
      map((posts: any[]) =>
        posts.map(post => ({
          ...post,
          items: this.parseItems(post.items),
          options: this.parseOptions(post.options),
        }))
      )
    );
  }

  /**
   * Faz o parse seguro do campo 'items'
   */
  private parseItems(items: string): any[] {
    try {
      return JSON.parse(items);
    } catch {
      return [{ content: 'Erro ao carregar conteúdo.' }];
    }
  }

  /**
   * Faz o parse seguro do campo 'options'
   */
  private parseOptions(options: string): string[] {
    try {
      return JSON.parse(options);
    } catch {
      return [];
    }
  }

  /**
   * Cria uma nova postagem com suporte a upload de imagem e opções
   */
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

  /**
   * Atualiza uma postagem existente
   */
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

  /**
   * Exclui uma postagem pelo ID
   */
  delete(id: number): Observable<any> {
    return this.api.delete(`posts/${id}`);
  }
}
