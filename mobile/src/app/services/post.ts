import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Post {
  private postsUrl = 'assets/posts-data.json'; // O caminho para o seu arquivo JSON

  constructor(private http: HttpClient) {}

  // Esta função retorna um array de posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.postsUrl);
  }
}