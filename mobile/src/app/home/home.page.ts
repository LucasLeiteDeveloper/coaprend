import { Component } from '@angular/core';
import { Post } from '../services/post';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {
  public posts: any[] = []; // Array começa vazio para não ter posts "falsos"

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
        {
          name: 'postDate',
          type: 'date',
          placeholder: 'Data',
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
    const newPost = {
      title: postData.title,
      content: postData.content,
      postDate: postData.postDate,
    };
    this.posts.push(newPost);
  };

  ngOnInit() {
    // Removido o código de posts "falsos" para que a lista comece vazia
    // this.postService.getPosts().subscribe((data) => {
    //   this.posts = data;
    // });
  };
}