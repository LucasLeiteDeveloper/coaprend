// src/app/pages/post-create/create-post.page.ts

import { Component } from '@angular/core';
import { PostService } from 'src/app/services/postService/post';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-post-create',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
  standalone: false
})
export class PostCreatePage {

  post = {
    title: '',
    type: 'text',
    content: '',
    options: [] as string[],
    tag_color: '#000000',
  };

  selectedFile?: File;
  imagePreview: string | null = null;
  selectedFileName: string | null = null;
  saving = false;

  constructor(
    private postService: PostService,
    private toastCtrl: ToastController
  ) {
    this.post.options = [];
  }

  onTypeChange() {
    this.imagePreview = null;
    this.selectedFile = undefined;

    if (this.post.type === 'question' && this.post.options.length === 0) {
      this.post.options = ['', ''];
    }

    if (this.post.type !== 'question') {
      this.post.options = [];
    }

    if (this.post.type !== 'image') {
      this.post.content = '';
    }
  }

  addOption() {
    this.post.options.push('');
  }

  removeOption(index: number) {
    this.post.options.splice(index, 1);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.selectedFile = file;
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async submit() {
    if (!this.post.title || this.post.title.trim().length === 0) {
      const t = await this.toastCtrl.create({
        message: 'Título obrigatório',
        duration: 2000,
        color: 'warning',
      });
      return t.present();
    }

    this.saving = true;

    this.postService.createFormData(this.post, this.selectedFile).subscribe({
      next: async () => {
        const t = await this.toastCtrl.create({
          message: 'Post criado com sucesso!',
          duration: 2000,
          color: 'success',
        });
        t.present();
        this.resetForm();
        this.saving = false;
      },
      error: async (err) => {
        console.error(err);
        const t = await this.toastCtrl.create({
          message: 'Erro ao criar post',
          duration: 2500,
          color: 'danger',
        });
        t.present();
        this.saving = false;
      },
    });
  }

  resetForm() {
    this.post = {
      title: '',
      type: 'text',
      content: '',
      options: [],
      tag_color: '#000000',
    };
    this.selectedFile = undefined;
    this.imagePreview = null;
    this.selectedFileName = null;
  }
}
