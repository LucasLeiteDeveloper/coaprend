import { Component } from '@angular/core';
import { PostService } from 'src/app/services/postService/post';
import { ToastController, NavController, ModalController } from '@ionic/angular';
import { InputModalComponent } from 'src/app/components/input-modal/input-modal.component';
import { ClassService } from 'src/app/services/classService/class';
import { TagService } from 'src/app/services/tagService/tag';
import { firstValueFrom } from 'rxjs';
import { ContentService } from 'src/app/services/contentService/content-service';

interface PostData {
  title: string,
  content: string,
  image?: File,
  tags?: string[]
  date?: Date
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: false,
})
export class PostPage {
  postData: PostData = {
    title: '',
    content: '',
  }

  title: string = '';
  content: string = '';
  image?: File;

  showCalendar = false;
  postDate: string | null = null;

  type: string = 'text';
  tag_color: string = '#3B82F6';

  classId: string | null = null;
  classTags: any[] = [];

  selectedTags: any[] = [];

  constructor(
    private postService: PostService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private modal: ModalController,
    private contentService: ContentService,
    private classService: ClassService,
    private tagService: TagService,
  ) {}

  async ngOnInit() {
    await this.loadUserClass();
    await this.loadTags();
  }

  // --------------------------------------------------------------------
  // 🔵 Carregar sala atual do usuário
  // NÃO usa toPromise (depreciado). Usa firstValueFrom corretamente.
  // --------------------------------------------------------------------
  async loadUserClass() {
    try {
      this.classId = localStorage.getItem("classId");
    } catch {
      console.error('Erro ao carregar sala atual');
    }
  }

  // --------------------------------------------------------------------
  // 🟢 Carregar tags da sala selecionada
  // --------------------------------------------------------------------
  async loadTags() {
    if (!this.classId) return;

    try {
      const response = await this.contentService.getClassTags(this.classId);
      

      if(response) this.classTags = response;
    } catch {
      console.error('Erro ao carregar tags da sala');
    }
  }

  // --------------------------------------------------------------------
  // 📅 Abrir calendário
  // --------------------------------------------------------------------
  openCalendar() {
    this.showCalendar = true;
  }

  confirmDate() {
    this.showCalendar = false;
  }

  // --------------------------------------------------------------------
  // 🏷 Abrir seletor de tags
  // --------------------------------------------------------------------
  async openTagSelector() {
    const modal = await this.modal.create({
      component: InputModalComponent,
      componentProps: {
        title: 'Selecionar Tags',
        inputType: 'tags',
        tags: this.classTags,
        selectedTags: this.selectedTags 
      }
    });

    await   modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.selectedTags = data;
      this.postData.tags = data;
    }
  }

  // --------------------------------------------------------------------
  // 📝 Criar post
  // --------------------------------------------------------------------
  createPost() {
    console.log("Dados do post: ", this.postData);
    if (!this.title.trim()) {
      this.showToast('O título é obrigatório!');
      return;
    }

    const finalDate = this.postDate
      ? this.postDate.split('T')[0]
      : new Date().toISOString().split('T')[0];

    const payload = {
      title: this.title,
      content: this.content,
      type: this.type,
      tag_color: this.tag_color,
      options: this.selectedTags,
      date: finalDate,
      class_id: this.classId,
    };

    this.postService.createFormData(payload, this.image).subscribe({
      next: () => {
        this.showToast('Post criado com sucesso!');
        this.navCtrl.back();
      },
      error: () => this.showToast('Erro ao criar post.')
    });
  }

  // --------------------------------------------------------------------
  // 📁 Imagem
  // --------------------------------------------------------------------
  onFileSelected(ev: any) {
    this.image = ev.target.files[0];
  }

  // --------------------------------------------------------------------
  // 🔔 Toast
  // --------------------------------------------------------------------
  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'primary'
    });
    toast.present();
  }
}
