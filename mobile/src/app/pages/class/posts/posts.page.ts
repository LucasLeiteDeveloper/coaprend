import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/postService/post'; // caminho do seu service
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: false,
})

export class PostsPage implements OnInit {
  posts: any = "";

  constructor(
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.http.get("assets/posts-data.json").subscribe({
      next: (data) => {
        this.posts = data;
        console.log('Posts carregados:', this.posts);
      },
      error: (err) => {
        console.error('Erro ao carregar os posts:', err);
      }
    });
  }

  // loadPosts() {
  //   this.postService.getAll().subscribe({
  //     next: (res) => {
  //       this.posts = res.map((p: any) => ({
  //         ...p,
  //         options: p.options ? JSON.parse(p.options) : [],
  //       }));
  //       console.log('Posts carregados:', this.posts);
  //     },
  //     error: (err) => {
  //       console.error('Erro ao carregar posts:', err);
  //     },
  //   });
  // }
}
