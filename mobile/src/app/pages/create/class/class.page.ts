import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-create-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class CreateClassPage {
  classData = {
    title: '',
    description: '',
    icon: null as File | null,
    tags: [] as string[]
  };
  newTag!: string;

  constructor(
    private contentService: ContentService,
    private toastController: ToastController,
    private router: Router
  ) {}

  // Abrir seletor de arquivo
  public openFileDialog = () => {
    (document as any).getElementById("file-upload").click();
  };

  // Selecionar imagem
  public setImage = (_event: any) => {
    const file = _event.target.files![0];
    if (file) {
      // check if is an image
      if(!file.type.startsWith('image/')){
        this.showToast("Por favor, selecione apenas arquivos de imagem.");
        return;
      }

      // check file size (5MB)
      if(file.size > 5 * 1024 * 1024){
        this.showToast("A imagem deve ter no máximo 5MB!");
        return;
      }

      this.classData.icon = file;
    }
  };

  // Adicionar tag
  addTag() {
    if (!this.newTag.trim()) return;
    this.classData.tags.push(this.newTag.trim());
    this.newTag = '';
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

    try {
      let iconUrl = '';

      if (this.classData.icon){
        this.showToast("Salvando imagem..");
      }

      const classDataToSend = {
        title: this.classData.title.trim(),
        description: this.classData.description.trim(),
        icon: iconUrl,
        tags: this.classData.tags
      }

      console.log("Enviando dados: ", classDataToSend);
      const response = await this.contentService.createClass(classDataToSend);
      console.log("Resposta recebida: ", response);

      await this.showToast(`Sala criada com sucesso! Código: ${response.code}`);
    } catch(error: any){
      console.error("Erro ao criar sala: ", error);
      this.showToast("Erro ao criar sala!");
    };
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