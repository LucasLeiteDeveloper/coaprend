import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PostService {
  constructor(private api: ApiService) {}

  public readonly get = {
    byPostId: (id: string) => {
      
    },

    byClassId: (id: string): Observable<any> => {
      const posts = this.api.get('posts').pipe(
        map((posts: any[]) =>
          posts.map(post => ({
            ...post,
            items: post.item,
            options: post.options,
          }))
        )
      );
      return posts;
    },

    byUserId: (id: string) => {
      
    },

    byDateRange: (firstDate: string, lastDate: string): Observable<any> => {
      return this.api.get(`posts/range?start=${firstDate}&end=${lastDate}`);
    },

    byWord: (text: string): Observable<any> => {
      return this.api.get(`posts/search?text=${text}`);
    },
  }

  public delete(id: number): Observable<any> {
    return this.api.delete(`posts/${id}`);
  }

  public create(payload: any, file?: File): Observable<any> {
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

  public update(id: number, payload: any, file?: File): Observable<any> {
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
}

export interface PostInterface {
  id: string;
  title: string;
  content: string;
  username: string;
  tags: string[];
  date: null;
}