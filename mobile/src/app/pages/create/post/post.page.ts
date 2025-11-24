import { Component } from '@angular/core';
import { PostService } from 'src/app/services/postService/post';
import { ToastController, NavController, ModalController } from '@ionic/angular';
import { InputModalComponent } from 'src/app/components/input-modal/input-modal.component';
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

  postDate: string | null = null; // data opcional

  // showDateSelector = false; // <-- desativado por enquanto

  type: string = 'text';
  tag_color: string = '#3B82F6';

  constructor(
    private postService: PostService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private modal: ModalController,
  ) {}

  ngOnInit() {}

  // Função neutra para impedir erros enquanto os componentes ainda não existem
  noop() {}

  /*
  toggleDateSelector() {
    this.showDateSelector = !this.showDateSelector;
  }

  onDateSelected(date: string) {
    this.postDate = date;
    this.showDateSelector = false;
  }

  onCancelDate() {
    this.showDateSelector = false;
  }
  */

  createPost() {
    if (!this.title) {
      this.showToast('O título é obrigatório!');
      return;
    }

    const finalDate =
      this.postDate ??
      new Date().toISOString().split('T')[0]; // data atual caso nenhuma seja escolhida

    const payload = {
      title: this.title,
      content: this.content,
      type: this.type,
      tag_color: this.tag_color,
      options: [],
      date: finalDate, // <-- incluído no registro
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

  async openTextModal(title: string, inputType: string) {
    const modal = await this.modal.create({
      component: InputModalComponent,
      componentProps: { 
        title: title,
        inputType: inputType,
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log(`Hello, ${data}!`);
    }
  }
}
