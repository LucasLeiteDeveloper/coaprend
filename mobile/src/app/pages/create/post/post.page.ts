import { Component } from '@angular/core';
import { PostService } from 'src/app/services/postService/post';
import { ToastController, NavController, ModalController } from '@ionic/angular';
import { InputModalComponent } from 'src/app/components/input-modal/input-modal.component';
import { ClassService } from 'src/app/services/classService/class';
import { TagService } from 'src/app/services/tagService/tag';
import { firstValueFrom } from 'rxjs';

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

  showCalendar = false;
  postDate: string | null = null;

  type: string = 'text';
  tag_color: string = '#3B82F6';

  userClassId!: number;
  selectedClassId!: number;
  classTags: any[] = [];

  selectedTags: any[] = [];

  constructor(
    private postService: PostService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private modal: ModalController,
    private classService: ClassService,
    private tagService: TagService,
  ) {}

  async ngOnInit() {
    await this.loadUserClass();
    await this.loadTags();
  }

  async loadUserClass() {
    try {
      const stored: any = await firstValueFrom(
        this.classService.get.currentClassId()
      );

      this.userClassId = stored.id;
      this.selectedClassId = stored.id;
    } catch {
      console.error('Erro ao carregar sala atual');
    }
  }

  async loadTags() {
    if (!this.selectedClassId) return;

    try {
      // this.classTags = await firstValueFrom(
      //   this.tagService.getTagsByClass(this.selectedClassId)
      // );
    } catch {
      console.error('Erro ao carregar tags da sala');
    }
  }

  openCalendar() {
    this.showCalendar = true;
  }

  confirmDate() {
    this.showCalendar = false;
  }

  async openTagSelector() {
    const modal = await this.modal.create({
      component: InputModalComponent,
      componentProps: {
        title: 'Selecionar Tags',
        inputType: 'tags',
        tags: this.classTags,
        selected: this.selectedTags
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.selectedTags = data;
    }
  }

  createPost() {
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
      class_id: this.selectedClassId,
    };

    this.postService.create(payload, this.image).subscribe({
      next: () => {
        this.showToast('Post criado com sucesso!');
        this.navCtrl.back();
      },
      error: () => this.showToast('Erro ao criar post.')
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
