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

  constructor(
    private classService: ClassService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async createClass() {
    if (!this.className.trim()) {
      this.showToast('O nome da sala é obrigatório.');
      return;
    }

    const payload = {
      nome: this.className,
      descricao: '',
    };

    this.classService.createClass(payload).subscribe({
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

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}

