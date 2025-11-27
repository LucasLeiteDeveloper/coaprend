import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClassService } from 'src/app/services/classService/class';

@Component({
  selector: 'app-create-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class CreateClassPage implements OnInit{
  classData = {
    title: '',
    description: '',
    icon: '',
    tags: [] as string[]
  };
  newTag!: string;

  constructor(
    private classService: ClassService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
      this.showData();
  }
  showData(){ console.table(this.classData) }

  // Abrir seletor de arquivo
  public openFileDialog = () => {
    (document as any).getElementById("file-upload").click();
  };

  // Selecionar imagem
  public setImage = (_event: any) => {
    const f = _event.target.files![0];
    if (f) this.classData.icon = f;
  };

  // Adicionar tag
  addTag() {
    if (!this.newTag.trim()) return;
    this.classData.tags.push(this.newTag.trim());
    this.newTag = '';

    this.showData();
  }

  // Remover tag
  removeTag(index: number) {
    this.classData.tags.splice(index, 1);
  }

  // Criar sala
  async createClass() {
    if (!this.classData.title.trim()) {
      this.showToast('O nome da sala é obrigatório.');
      return;
    }

    const form = new FormData();
    form.append('nome', this.classData.title);
    form.append('descricao', '');
    
    if (this.classData.icon) {
      form.append('imagem', this.classData.icon);
    }

    if (this.classData.tags.length > 0) {
      this.classData.tags.forEach((t, i) => form.append(`tags[${i}]`, t));
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
