import { Component } from '@angular/core';
import { PostService } from 'src/app/services/postService/post';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-post-create',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: false,
})
export class PostPage {
  title: string = '';
  content: string = '';
  image?: File;

  // campos obrigatórios exigidos pelo backend
  type: string = 'text';
  tag_color: string = '#3B82F6'; // azul padrão (pode mudar)

  constructor(
    private postService: PostService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  // chamada ao clicar no FAB (+)
  createPost() {
    if (!this.title) {
      this.showToast('O título é obrigatório!');
      return;
    }

    const payload = {
      title: this.title,
      content: this.content,
      type: this.type,
      tag_color: this.tag_color,
      options: [], // por enquanto vazio
    };

    this.postService.createFormData(payload, this.image).subscribe({
      next: () => {
        this.showToast('Post criado com sucesso!');
        this.navCtrl.back();
      },
      error: (err) => {
        console.error(err);
        this.showToast('Erro ao criar post.');
      }
    });
  }

  onFileSelected(ev: any) {
    this.image = ev.target.files[0];
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'primary'
    });
    toast.present();
  }
}

