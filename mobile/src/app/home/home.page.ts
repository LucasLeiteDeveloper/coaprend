import { Component } from '@angular/core';
import { Post } from '../services/post';
import { AlertController } from '@ionic/angular';

interface PostInterface {
  title: string;
  content: string;
  postDate: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {
  public posts: PostInterface[] = []; // Array tipado com a interface

  constructor(
    private postService: Post,
    private alertController: AlertController,
  ) {};

  // Método para carregar posts do localStorage
  loadPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
    }
  }

  // Método para salvar posts no localStorage
  savePostsToLocalStorage() {
    localStorage.setItem('posts', JSON.stringify(this.posts));
  }

  async showCreatePostAlert() {
    const alert = await this.alertController.create({
      header: 'Criar Novo Post',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título',
        },
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'Conteúdo',
        },
        {
          name: 'postDate',
          type: 'date',
          placeholder: 'Data',
          value: this.formatDateForInput(new Date()), // Valor padrão com data atual
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Criar',
          handler: (data) => {
            console.log('Dados do post:', data);
            this.createPost(data);
          },
        },
      ],
    });
    await alert.present();
  };

  createPost(postData: { title: string; content: string; postDate: string }) {
    const newPost: PostInterface = {
      title: postData.title,
      content: postData.content,
      postDate: postData.postDate,
    };
    this.posts.push(newPost);
    
    // Salvar no localStorage após criar o post
    this.savePostsToLocalStorage();
  };

  // Método auxiliar para formatar data para o input
  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit() {
    // Carrega os posts salvos no localStorage ao inicializar o componente
    this.loadPostsFromLocalStorage();
    
    // Removido o código de posts "falsos" para que a lista comece vazia
    // this.postService.getPosts().subscribe((data) => {
    //   this.posts = data;
    // });
  };
}