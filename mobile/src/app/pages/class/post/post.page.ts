import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/postService/post'; // caminho do seu service

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: false,
})
export class PostPage implements OnInit {

  posts: any[] = [];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAll().subscribe({
      next: (res) => {
        // Converte 'options' se vier como JSON no backend
        this.posts = res.map((p: any) => ({
          ...p,
          options: p.options ? JSON.parse(p.options) : [],
        }));
        console.log('Posts carregados:', this.posts);
      },
      error: (err) => {
        console.error('Erro ao carregar posts:', err);
      }
    });
  }
}
