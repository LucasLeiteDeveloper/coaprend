import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/postService/post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: false,
})
export class PostsPage implements OnInit {
  posts: any[] = [];

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit() {
    // Agora usando a API real
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAll().subscribe({
      next: (res) => {
        this.posts = res;
      },
      error: (err) => {
        console.error('Erro ao carregar posts:', err);
      }
    });
  }

  openPost(id: number) {
    this.router.navigate(['/class/post', id]);
  }
}
