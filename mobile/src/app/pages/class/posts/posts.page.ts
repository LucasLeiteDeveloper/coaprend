import { Component, OnInit } from '@angular/core'; 
import { PostService } from 'src/app/services/postService/post';
import { Router } from '@angular/router';
import { ClassPage } from '../class.page';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: false,
})
export class PostsPage implements OnInit {
  classId: string | null = null;
  posts: any[] | undefined = undefined;
  filteredPosts: any[] = [];
  postTest: any = {
    "id": 0,
    "title": "Dominando JavaScript Assíncrono: Promises, Async/Await e Tratamento de Erros",
    "content": "A programação assíncrona é fundamental no JavaScript moderno, especialmente ao lidar com requisições de rede (APIs) ou operações baseadas em tempo. Este artigo explora a progressão dos Callbacks tradicionais para as Promises modernas, oferecendo um mergulho profundo nos métodos `.then()`, `.catch()` e `.finally()`. Crucialmente, detalhamos como a sintaxe `async/await` simplifica as cadeias complexas de Promises, tornando o código assíncrono mais legível e fácil de depurar. Além disso, fornecemos melhores práticas para um tratamento de erros robusto usando blocos `try...catch` com `async/await` para evitar falhas inesperadas em suas aplicações web.",
    "username": "Felipe Souza",
    "tags": {
      "title": "Português",
    }
  };

  constructor(
    private postService: PostService,
    private contentService: ContentService,
    private router: Router,
    private classPage: ClassPage
  ) {}

  ngOnInit() {
    this.classId = localStorage.getItem("classId");
    this.loadPosts();

    // Atualiza filtro em tempo real
    this.classPage.tagFilter$.subscribe(() => {
      this.applyTagFilter();
    });
  }

  async loadPosts() {
    try {
      if(this.classId){
        const response = await this.contentService.getPosts(this.classId);

        this.posts = response;
      }
    } catch(error){
      console.log("Erro ao pegar os posts: ", error);
    }
  }

  private applyTagFilter() {
    const selectedTags = this.classPage.tags
      .filter((t: any) => t.selected)
      .map((t: any) => t.text);

    // if (!selectedTags.length) {
    //   this.filteredPosts = [...this.posts];
    //   return;
    // }

    // this.filteredPosts = this.posts.filter(post =>
    //   post.tags?.some((t: any) => selectedTags.includes(t.name ?? t))
    // );
  }
}