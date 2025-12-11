import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/services/classService/class';
import { TagService } from 'src/app/services/tagService/tag';
import { ToastController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: false,
})
export class ConfigPage implements OnInit {

  classId!: string;
  classData: any = {};
  inviteCode = '';

  // alterar nome
  newName = '';

  // alterar imagem
  newImage?: File;

  // tags
  tags: any[] = [];
  newTagName = '';
  newTagColor = '#3B82F6';

  // === CONTROLES DE INTERFACE (Necessários!) ===
  showNameEditor = false;
  showImagePicker = false;
  showTagEditor = false;

  constructor(
    private contentService: ContentService,
    private classService: ClassService,
    private tagService: TagService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {
    this.classId = this.route.snapshot.params['id'] || '';

    this.loadClassData();
  }

  // ============================
  // CARREGAR DADOS DA SALA
  // ============================

  async loadClassData() {
    try {
      const response = await this.contentService.getClassDetails(this.classId);
      console.log("Sala: ", response)

      if(response) {
        this.classData = response;
        this.inviteCode = response.code;
        this.newName = response.title;
        this.tags = Array.isArray(response.tags) ? response.tags : [response.tags];
      }
    } catch(error) {
      this.showToast("Erro ao carregar dados da classe");
      console.log("Erro ao carregar classe: ", error);
    }

    // this.classService.getCurrentUserClass().subscribe({
    //   next: (data) => {
    //     this.classData = data;
    //     this.classId = data.id;
    //     this.inviteCode = data.invite_code;
    //     this.newName = data.name;

    //     this.loadTags();
    //   },
    //   error: () => this.showToast('Erro ao carregar dados da sala.')
    // });
  }

  // ============================
  // CÓDIGO DE CONVITE
  // ============================

  copyInviteCode() {
    navigator.clipboard.writeText(this.inviteCode);
    this.showToast('Código copiado!');
  }

  regenerateCode() {
    // this.classService.regenerateCode(this.classId).subscribe({
    //   next: (res) => {
    //     this.inviteCode = res.invite_code;
    //     this.showToast('Novo código gerado.');
    //   },
    //   error: () => this.showToast('Erro ao gerar novo código.')
    // });
  }

  // ============================
  // EDITAR NOME DA SALA
  // ============================

  updateName() {
    const payload = { name: this.newName };

  // this.classService.updateClassName(this.classId, this.newName).subscribe({
  //   next: () => this.showToast('Nome atualizado!'),
  //   error: () => this.showToast('Erro ao atualizar nome.')
  // });
  }

  // ============================
  // ALTERAR FOTO DA SALA
  // ============================

  onImageSelected(ev: any) {
    this.newImage = ev.target.files[0];
  }

updatePhoto() {
  if (!this.newImage) {
    this.showToast('Selecione uma imagem.');
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const base64 = (reader.result as string).split(',')[1]; // remove cabeçalho data:image/...

    // this.classService.updateClassImage(this.classId, base64).subscribe({
    //   next: () => this.showToast('Foto atualizada!'),
    //   error: () => this.showToast('Erro ao atualizar foto.')
    // });
  };

  reader.onerror = () => {
    this.showToast('Erro ao ler imagem.');
  };

  reader.readAsDataURL(this.newImage);
}


  // ============================
  // TAGS DA SALA
  // ============================

  loadTags() {
    
  }

  createTag() {
    if (!this.newTagName.trim()) return;

    const payload = {
      name: this.newTagName,
      color: this.newTagColor
    };

    // this.tagService.createTag(this.classId, payload).subscribe({
    //   next: () => {
    //     this.newTagName = '';
    //     this.newTagColor = '#3B82F6';
    //     this.loadTags();
    //     this.showToast('Tag criada!');
    //   },
    //   error: () => this.showToast('Erro ao criar tag.')
    // });
  }

  updateTag(tag: any) {
    const payload = { name: tag.name, color: tag.color };

    // this.tagService.updateTag(this.classId, tag.id, payload).subscribe({
    //   next: () => this.showToast('Tag atualizada!'),
    //   error: () => this.showToast('Erro ao atualizar tag.')
    // });
  }

  async deleteTag(tag: string) {
    const newTags = this.tags.filter( t => t !== tag);
    
    const response = await this.contentService.updateClass(this.classId, { tags: newTags });

    console.log("Resposta da requisição: ", response);

    await this.loadClassData();

    // this.tagService.deleteTag(this.classId, tagId).subscribe({
    //   next: () => {
    //     this.tags = this.tags.filter(t => t.id !== tagId);
    //     this.showToast('Tag removida!');
    //   },
    //   error: () => this.showToast('Erro ao remover tag.')
    // });
  }

  // ============================
  // SAIR DA SALA
  // ============================

  leaveClass() {
    // this.classService.leaveClass(this.classId).subscribe({
    //   next: () => {
    //     this.showToast('Você saiu da sala.');
    //     this.navCtrl.navigateRoot('/home');
    //   },
    //   error: () => this.showToast('Erro ao sair da sala.')
    // });
  }

  // ============================
  // EXCLUIR SALA
  // ============================

  deleteClass() {
    // this.classService.deleteClass(this.classId).subscribe({
    //   next: () => {
    //     this.showToast('Sala excluída.');
    //     this.navCtrl.navigateRoot('/home');
    //   },
    //   error: () => this.showToast('Erro ao excluir sala.')
    // });
  }

  // ============================
  // TOAST
  // ============================

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'primary'
    });
    toast.present();
  }
}
