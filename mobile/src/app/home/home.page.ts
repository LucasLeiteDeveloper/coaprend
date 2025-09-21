import { Component } from '@angular/core';
import { Post } from '../services/post';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  posts: any[] = []; // Array para armazenar os posts

  constructor(private postService: Post) {}

  ngOnInit() {
    this.postService.getPosts().subscribe((data) => {
      this.posts = data;
      console.log('Posts carregados:', this.posts); // Verifique no console se os dados foram carregados
    });
  }
}
