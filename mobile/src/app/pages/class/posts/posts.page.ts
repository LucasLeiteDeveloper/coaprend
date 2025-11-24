import { Component, OnInit } from '@angular/core'; 
import { PostService } from 'src/app/services/postService/post';
import { Router } from '@angular/router';
import { ClassPage } from '../class.page';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: false,
})
export class PostsPage implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];

  constructor(
    private postService: PostService,
    private router: Router,
    private classPage: ClassPage
  ) {}

  ngOnInit() {
    this.loadPosts();

    // Atualiza filtro em tempo real
    this.classPage.tagFilter$.subscribe(() => {
      this.applyTagFilter();
    });
  }

  loadPosts() {
    this.postService.getAll().subscribe({
      next: (res) => {
        this.posts = res?.data || res || [];
        this.applyTagFilter();
      },
      error: (err) => {
        console.error('Erro ao carregar posts:', err);
      }
    });
  }

  private applyTagFilter() {
    const selectedTags = this.classPage.tags
      .filter((t: any) => t.selected)
      .map((t: any) => t.text);

    if (!selectedTags.length) {
      this.filteredPosts = [...this.posts];
      return;
    }

    this.filteredPosts = this.posts.filter(post =>
      post.tags?.some((t: any) => selectedTags.includes(t.name ?? t))
    );
  }

  openPost(id: number) {
    this.router.navigate([`/class/post/view/${id}`]);
  }
}
