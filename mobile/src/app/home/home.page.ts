import { Component } from '@angular/core';
import { Post } from '../services/post';
import { AlertController } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {
  public posts: any[] = []; // Array para armazenar os posts

  constructor(
    private postService: Post,
    private alertController: AlertController,
  ) {};

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
            // 'data' é um objeto que contém os valores dos inputs
            console.log('Dados do post:', data);

            // Chama o método para enviar os dados para a API
            this.createPost(data);
          },
        },
      ],
    });

    await alert.present();
  };

  // Cria o post (incompleto)
  createPost(postData: { title: string; content: string }) {};

  ngOnInit() {
    this.postService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  };
}
