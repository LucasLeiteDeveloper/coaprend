import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClassService } from 'src/app/services/classService/class';

@Component({
  selector: 'app-create-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class CreateClassPage {
  className: string = '';
  imageFile?: File;

  // Tags
  tags: string[] = [];
  newTag: string = '';

  constructor(
    private classService: ClassService,
    private toastController: ToastController,
    private router: Router
  ) {}

  // Abrir seletor de arquivo
  public openFileDialog = () => {
    (document as any).getElementById("file-upload").click();
  };

  // Selecionar imagem
  public setImage = (_event: any) => {
    const f = _event.target.files![0];
    if (f) this.imageFile = f;
  };

  // Adicionar tag
  addTag() {
    if (!this.newTag.trim()) return;
    this.tags.push(this.newTag.trim());
    this.newTag = '';
  }

  // Remover tag
  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  // Criar sala
  async createClass() {
    if (!this.className.trim()) {
      this.showToast('O nome da sala é obrigatório.');
      return;
    }

    const form = new FormData();
    form.append('nome', this.className);
    form.append('descricao', '');
    
    if (this.imageFile) {
      form.append('imagem', this.imageFile);
    }

    if (this.tags.length > 0) {
      this.tags.forEach((t, i) => form.append(`tags[${i}]`, t));
    }

    this.classService.createClass(form).subscribe({
      next: async () => {
        await this.showToast('Sala criada com sucesso!');
        this.router.navigate(['/class']);
      },
      error: async (err) => {
        console.error(err);
        await this.showToast('Erro ao criar sala.');
      },
    });
  }

  // Toast utilitário
  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}
