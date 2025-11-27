import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/services/classService/class';
import { TagService } from 'src/app/services/tagService/tag';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: false,
})
export class ConfigPage implements OnInit {
  public classId!: string;
  public class: any = {};
  public inviteCode = '';

  public newName = '';
  public newImage?: File;

  public tags: any[] = [];
  public newTagName = '';
  public newTagColor = '#3B82F6';

  public showNameEditor = false;
  public showImagePicker = false;
  public showTagEditor = false;

  constructor(
    private classService: ClassService,
    private tagService: TagService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadClassData();
  }

  // ============================
  // CARREGAR DADOS DA SALA
  // ============================

  loadClassData() {
    const classId = this.classService.get.currentClassId();
    this.class = this.classService.get.byClassId(classId);
  }

  copyInviteCode() {
    navigator.clipboard.writeText(this.inviteCode);
    this.showToast('Código copiado!');
  }

  regenerateCode() {
    this.classService.update.inviteLinkById(this.classId).subscribe({
      next: (res) => {
        this.inviteCode = res.invite_code;
        this.showToast('Novo código gerado.');
      },
      error: () => this.showToast('Erro ao gerar novo código.')
    });
  }

  updateName() {
    const payload = { name: this.newName };
    this.classService.update.nameById(this.classId, this.newName).subscribe({
      next: () => this.showToast('Nome atualizado!'),
      error: () => this.showToast('Erro ao atualizar nome.')
    });
  }

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

      this.classService.update.imageById(this.classId, base64).subscribe({
        next: () => this.showToast('Foto atualizada!'),
        error: () => this.showToast('Erro ao atualizar foto.')
      });
    };

    reader.onerror = () => {
      this.showToast('Erro ao ler imagem.');
    };

    reader.readAsDataURL(this.newImage);
  }


  // ============================
  // TAGS DA SALA
  // ============================

  // loadTags() {
  //   this.tagService.TagsByClass(this.classId).subscribe({
  //     next: (tags) => this.tags = tags,
  //     error: () => this.showToast('Erro ao carregar tags.')
  //   });
  // }

  createTag() {
    if (!this.newTagName.trim()) return;

    const payload = {
      name: this.newTagName,
      color: this.newTagColor
    };

    this.tagService.createTag(this.classId, payload).subscribe({
      next: () => {
        this.newTagName = '';
        this.newTagColor = '#3B82F6';
        // this.loadTags();
        this.showToast('Tag criada!');
      },
      error: () => this.showToast('Erro ao criar tag.')
    });
  }

  updateTag(tag: any) {
    const payload = { name: tag.name, color: tag.color };

    this.tagService.updateTag(this.classId, tag.id, payload).subscribe({
      next: () => this.showToast('Tag atualizada!'),
      error: () => this.showToast('Erro ao atualizar tag.')
    });
  }

  // deleteTag(tagId: number) {
  //   this.tagService.deleteTag(this.classId, tagId).subscribe({
  //     next: () => {
  //       this.tags = this.tags.filter(t => t.id !== tagId);
  //       this.showToast('Tag removida!');
  //     },
  //     error: () => this.showToast('Erro ao remover tag.')
  //   });
  // }

  // ============================
  // SAIR DA SALA
  // ============================

  leaveClass() {
    this.classService.leaveById(this.classId).subscribe({
      next: () => {
        this.showToast('Você saiu da sala.');
        this.navCtrl.navigateRoot('/home');
      },
      error: () => this.showToast('Erro ao sair da sala.')
    });
  }

  deleteClass() {
    this.classService.delete.byClassId(this.classId).subscribe({
      next: () => {
        this.showToast('Sala excluída.');
        this.navCtrl.navigateRoot('/home');
      },
      error: () => this.showToast('Erro ao excluir sala.')
    });
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
